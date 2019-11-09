import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Media } from './media';
import { DatabaseService } from './database.service';
import { map } from 'rxjs/operators';
import { MediaType } from './mediaType';

@Injectable({
	providedIn: 'root'
})
export class MediaService {

	constructor() { }


	public getAll(): Observable<Media[]> {
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

	public get(id: number): Observable<Media> {
		const sql = 'SELECT * FROM media WHERE id = $id';
		const values = { $id: id };

		return DatabaseService.selectOne(sql, values).pipe(
			map((row) => new Media().fromRow(row))
		);
	}

	public insert(media: Media): Observable<Media> {
		this.validate(media);

		const sql = 'INSERT INTO media (url, title, type) VALUES ($url, $title, $type)';
		const values = { $url: media.url, $title: media.title, $type: media.type };

		return DatabaseService.insert(sql, values).pipe(
			map((result) => {
				media.id = result.lastID
				return media;
			})
		);
	}

	public validate(media: Media): void {
		if (media.url.indexOf('http') === -1 && media.url.indexOf('file') === -1) {
			console.error('a protocol is required for media url');
		}

		if (!media.type) media.type = this.inferTypeFromUrl(media.url);
		if (!media.title) media.title = this.inferTitleFromUrl(media.url);
	}

	public inferTypeFromUrl(mediaURL: string): MediaType {
		if (!mediaURL) {
			console.error('A url is required to infer media type');
			return;
		}

		if (this.urlIsImage(mediaURL)) return MediaType.IMAGE;
		else if (this.urlIsGif(mediaURL)) return MediaType.GIF;
		else if (this.urlIsVideo(mediaURL)) return MediaType.VIDEO;
		else if (this.urlIsAudio(mediaURL)) return MediaType.AUDIO;
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

	private urlIsAudio(url: string): boolean {
		let match = url.match(/^((https?|ftp):)?\/\/.*(mp3)$/);
		return (match && match.length > 0) ? true : false;
	}

	public inferTitleFromUrl(mediaURL: string): string {
		if (!mediaURL) return '';

		let match = mediaURL.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/);
		return (match && match.length > 0) ? match[0] : '';
	}
}
