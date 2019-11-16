import { Injectable } from '@angular/core';
import { Observable, concat } from 'rxjs';
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
		const sql = `select albums.id, albums.title, albums.created_at, media.id media_id, media.url media_url, media.type media_type from albums LEFT OUTER JOIN albumCovers on albums.id == albumCovers.album_id LEFT OUTER JOIN media ON albumCovers.media_id == media.id ORDER BY albums.created_at DESC`;
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
		const sql = `select albums.id, albums.title, albums.created_at, media.id media_id, media.url media_url, media.type media_type from albums LEFT OUTER JOIN albumCovers on albums.id == albumCovers.album_id LEFT OUTER JOIN media ON albumCovers.media_id == media.id WHERE albums.id == $albumId`;
		const values = { $albumId: id };

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

	public getAllMediaByAlbumId(albumId: number): Observable<Media[]> {
		let fauxAlbum: Album = new Album();
		fauxAlbum.id = albumId;
		return this.getAllMedia(fauxAlbum);
	}

	public getAlbumsByMedia(media: Media): Observable<Album[]> {
		const sql = `SELECT albums.id, albums.title FROM mediaAlbumsMap INNER JOIN albums ON albums.id == mediaAlbumsMap.album_id WHERE mediaAlbumsMap.media_id = $mediaId`;
		const values = {$mediaId: media.id};

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
		const sql = `UPDATE albums SET title = $title WHERE id == $albumId`;
		const values = { $title: album.title, $albumId: album.id };

		let albumUpdate = DatabaseService.update(sql, values).pipe(
			map(() => {
				return album;
			})
		);

		let albumCoverId = (album.cover.id)? album.cover.id : null;
		let coverUpdate;
		if (albumCoverId) {
			coverUpdate = this.updateCover(album);
		} else {
			coverUpdate = this.insertCover(album);
		}

		return concat<Album>(albumUpdate, coverUpdate);
	}

	private updateCover(album: Album): Observable<Album> {
		let albumCoverId = (album.cover.id)? album.cover.id : null;
		const sql = `UPDATE albumCovers SET media_id = $mediaId WHERE album_id == $albumId`;
		const values = { $mediaId: albumCoverId, $albumId: album.id };

		return DatabaseService.update(sql, values).pipe(
			map(() => {
				return album;
			})
		);
	}

	private insertCover(album: Album): Observable<Album> {
		let albumCoverId = (album.cover.id)? album.cover.id : null;
		const sql = `INSERT INTO albumCovers (album_id, media_id) VALUES ($albumId, $mediaId)`;
		const values = { $albumId: album.id, $mediaId: albumCoverId };

		return DatabaseService.insert(sql, values).pipe(
			map(() => {
				return album;
			})
		);
	}

	public removeMedia(media: Media, album: Album): Observable<Album> {
		const sql = `DELETE FROM mediaAlbumsMap WHERE album_id == $albumId AND media_id == $mediaId`;
		const values = { $albumId: album.id, $mediaId: media.id };

		return DatabaseService.update(sql, values).pipe(
			map(() => {
				return album;
			})
		);
	}

	public removeCover(album: Album): Observable<boolean> {
		const sql = `DELETE FROM albumCovers WHERE album_id == $albumId`;
		const values = { $albumId: album.id };

		return DatabaseService.delete(sql, values).pipe(
			map(() => {
				return true;
			})
		);
	}

	public removeCoverByMedia(media: Media): Observable<boolean> {
		const sql = `DELETE FROM albumCovers WHERE mediaId == $mediaId`;
		const values = { $mediaId: media.id };

		return DatabaseService.delete(sql, values).pipe(
			map(() => {
				return true;
			})
		);
	}

	public delete(album: Album): Observable<boolean> {
		const sql = `DELETE FROM albums WHERE id == $albumId`;
		const values = {$albumId: album.id};

		return DatabaseService.delete(sql, values).pipe(
			map(() => {
				return true;
			})
		);
	}

}
