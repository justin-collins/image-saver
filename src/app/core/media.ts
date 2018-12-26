import { DatabaseService } from "./database.service";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

export class Media {
	protected id: number;
	public url: string;
	public type: MediaType;

	public static get(id: number): Observable<Media> {
		const sql = 'SELECT * FROM media WHERE id = $id';
		const values = { $id: id };

		return DatabaseService.selectOne(sql, values).pipe(
			map((row) => new Media().fromRow(row))
		);
	}

	public insert(): Observable<Media> {
		const sql = 'INSERT INTO media (url, type) VALUES ($url, $type)';
		const values = { $url: this.url, $type: this.type };

		return DatabaseService.insert(sql, values).pipe(
			map((result) => {
				this.id = result.lastID
				return this;
			})
		);
	}

	public fromRow(row: object): Media {
        this.id = row['id'];
        this.url = row['url'];

        return this;
    }
}

export enum MediaType {
	Image = 'Image',
	Gif = 'Gif',
	Video = 'Video'
}
