import { DatabaseService } from "./database.service";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

export class Media {
	protected id: number;
	public title: string;
	public url: string;
	protected type: MediaType;

	public static getAll(): Observable<Media[]> {
		const sql = 'SELECT * FROM media';
		const values = {};

		return DatabaseService.selectAll(sql, values).pipe(
			map((rows) => {
				const media: Media[] = [];
				for (const row of rows) {
					media.push(new Media().fromRow(row));
				}
				return media;
			})
		);
	}

	public static get(id: number): Observable<Media> {
		const sql = 'SELECT * FROM media WHERE id = $id';
		const values = { $id: id };

		return DatabaseService.selectOne(sql, values).pipe(
			map((row) => new Media().fromRow(row))
		);
	}

	public insert(): Observable<Media> {
		this.validate();

		const sql = 'INSERT INTO media (url, title, type) VALUES ($url, $title, $type)';
		const values = { $url: this.url, $title: this.title, $type: this.type };

		return DatabaseService.insert(sql, values).pipe(
			map((result) => {
				this.id = result.lastID
				return this;
			})
		);
	}

	public validate(): void {
		if (this.url.indexOf('http') === -1 && this.url.indexOf('file') === -1) {
			console.error('a protocol is required for media url');
		}

		if (!this.type) this.type = this.inferTypeFromUrl();
		if (!this.title) this.title = this.inferTitleFromUrl();
	}

	public inferTypeFromUrl(): MediaType {
		if (!this.url) {
			console.error('A url is required to infer media type');
			return;
		}

		if (this.urlIsImage(this.url)) return MediaType.Image;
		else if (this.urlIsGif(this.url)) return MediaType.Gif;
		else if (this.urlIsVideo(this.url)) return MediaType.Video;
		else console.error('Unknown file extension');
	}

	private urlIsImage(url: string): boolean {
		let match = url.match(/^((https?|ftp):)?\/\/.*(jpeg|jpg|png|bmp)$/);
		return (match && match.length > 0) ? true : false;
	}

	private urlIsGif(url: string): boolean {
		let match = url.match(/^((https?|ftp):)?\/\/.*(gif|gifv)$/);
		return (match && match.length > 0) ? true : false;
	}

	private urlIsVideo(url: string): boolean {
		let match = url.match(/^((https?|ftp):)?\/\/.*(mp4)$/);
		return (match && match.length > 0) ? true : false;
	}

	public inferTitleFromUrl(): string {
		if (!this.url) return '';

		let match = this.url.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/);
		return (match && match.length > 0) ? match[0] : '';
	}

	public fromRow(row: object): Media {
        this.id = row['id'];
        this.title = row['title'];
        this.url = row['url'];
        this.type = row['type'];

        return this;
    }
}

export enum MediaType {
	Image = 'Image',
	Gif = 'Gif',
	Video = 'Video'
}
