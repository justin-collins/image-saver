import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Album } from './album';
import { DatabaseService } from './database.service';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class AlbumService {

	constructor() { }

	public getAll(): Observable<Album[]> {
		const sql = `SELECT * FROM albums ORDER BY created_at DESC`;
		const values = {};

		return DatabaseService.selectAll(sql, values).pipe(
			map((rows) => {
				const album: Album[] = [];
				for (const row of rows) {
					album.push(new Album().fromRow(row));
				}
				return album;
			})
		);
	}

	public get(id: number): Observable<Album> {
		const sql = `SELECT * FROM albums WHERE id = $id`;
		const values = { $id: id };

		return DatabaseService.selectOne(sql, values).pipe(
			map((row) => new Album().fromRow(row))
		);
	}

	public insert(album: Album): Observable<Album> {
		const sql = `INSERT INTO albums (title) VALUES ($title)`;
		const values = { $title: album.title };

		return DatabaseService.insert(sql, values).pipe(
			map((result) => {
				album.id = result.lastID;
				return album;
			})
		);
	}

}
