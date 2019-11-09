import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Album } from './album';
import { DatabaseService } from './database.service';
import { map } from 'rxjs/operators';
import { Media } from './media';

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

	public getAllMedia(album: Album): Observable<Media[]> {
		const sql = `SELECT media.id, media.title, media.type, media.url FROM mediaAlbumsMap INNER JOIN media ON media.id == mediaAlbumsMap.media_id WHERE mediaAlbumsMap.album_id == $albumId AND media.trashed == 0;`;
		const values = { $albumId: album.id };

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

	public update(album: Album): Observable<Album> {
		let albumCoverId = (album.cover)? album.cover.id : null;
		const sql = `UPDATE albums SET title = $title, cover_media_id = $coverMediaId WHERE id == $albumId`;
		const values = { $title: album.title, $coverMediaId: albumCoverId, $albumId: album.id };

		return DatabaseService.update(sql, values).pipe(
			map(() => {
				return album;
			})
		);
	}
}
