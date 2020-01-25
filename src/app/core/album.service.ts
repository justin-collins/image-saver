import { Injectable } from '@angular/core';
import { Observable, concat, forkJoin } from 'rxjs';
import { Album } from './album';
import { DatabaseService } from './database.service';
import { map } from 'rxjs/operators';
import { Media } from './media';

export interface AlbumFilter {
	term?: string;
	orderBy?: string;
}

@Injectable({
	providedIn: 'root'
})
export class AlbumService {
	private albumWithCoverQuery: string = `SELECT albums.id, albums.title, albums.created_at, media.id media_id, media.url media_url, media.type media_type from albums
											LEFT JOIN albumCovers ON albums.id == albumCovers.album_id
											LEFT JOIN media ON albumCovers.media_id == media.id`

	constructor() { }

	public getAll(): Observable<Album[]> {
		const sql = `${this.albumWithCoverQuery}
					ORDER BY albums.created_at DESC`;
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

	public getFiltered(filter: AlbumFilter): Observable<Album[]> {
		let sql = this.albumWithCoverQuery;

		if (filter.term) sql += ` WHERE albums.title LIKE "%${filter.term}%"`;

		if(filter.orderBy) {
			sql += ` ORDER BY albums.${filter.orderBy}`;
			sql += (filter.orderBy === 'created_at') ? ' DESC' : ' ASC';
		}

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
		const sql = `${this.albumWithCoverQuery}
					WHERE albums.id == $albumId`;
		const values = { $albumId: id };

		return DatabaseService.selectOne(sql, values).pipe(
			map((row) => new Album().fromRow(row))
		);
	}

	public getAlbumsByMedia(media: Media): Observable<Album[]> {
		const sql = `SELECT albums.id, albums.title, albums.created_at, media.id media_id, media.url media_url, media.type media_type from mediaAlbumsMap
					LEFT JOIN albums on albums.id == mediaAlbumsMap.album_id
					LEFT JOIN albumCovers on albums.id == albumCovers.album_id
					LEFT JOIN media ON albumCovers.media_id == media.id
					WHERE mediaAlbumsMap.media_id = $mediaId`;
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

	public addMedia(album: Album, media: Media | Media[]): Observable<Media | Media[]> {
		if (media instanceof Array) {
			return this.addManyMedia(album, media);
		} else {
			return this.addSingleMedia(album, media);
		}
	}

	private addManyMedia(album: Album, media: Media[]): Observable<Media[]> {
		let inserts = [];
		for (let i = 0; i < media.length; i++) {
			const theMedia = media[i];
			inserts.push(this.addSingleMedia(album, theMedia));
		}

		return forkJoin<Media>(inserts);
	}

	private addSingleMedia(album: Album, media: Media): Observable<Media> {
		const sql = `INSERT INTO  mediaAlbumsMap (media_id, album_id) VALUES ($mediaId, $albumId);`;
		const values = { $mediaId: media.id, $albumId: album.id };

		return DatabaseService.insert(sql, values).pipe(
			map(() => media)
		);
	}

	public update(album: Album): Observable<Album> {
		const sql = `UPDATE albums SET title = $title WHERE id == $albumId`;
		const values = { $title: album.title, $albumId: album.id };

		let albumUpdate = DatabaseService.update(sql, values).pipe(
			map(() => album)
		);

		let coverInsert = this.insertCover(album);

		return concat<Album>(albumUpdate, coverInsert);
	}

	private insertCover(album: Album): Observable<Album> {
		let albumCoverId = (album.cover.id)? album.cover.id : null;
		const sql = `INSERT INTO albumCovers (album_id, media_id) VALUES ($albumId, $mediaId) ON CONFLICT(album_id) DO UPDATE SET media_id = $mediaId`;
		const values = { $albumId: album.id, $mediaId: albumCoverId };

		return DatabaseService.insert(sql, values).pipe(
			map(() => album)
		);
	}

	public removeMedia(media: Media, album: Album): Observable<Album> {
		const sql = `DELETE FROM mediaAlbumsMap WHERE album_id == $albumId AND media_id == $mediaId`;
		const values = { $albumId: album.id, $mediaId: media.id };

		return DatabaseService.update(sql, values).pipe(
			map(() => album)
		);
	}

	public removeCover(album: Album): Observable<boolean> {
		const sql = `DELETE FROM albumCovers WHERE album_id == $albumId`;
		const values = { $albumId: album.id };

		return DatabaseService.delete(sql, values).pipe(
			map(() => true)
		);
	}

	public removeCoverByMedia(media: Media): Observable<boolean> {
		const sql = `DELETE FROM albumCovers WHERE mediaId == $mediaId`;
		const values = { $mediaId: media.id };

		return DatabaseService.delete(sql, values).pipe(
			map(() => true)
		);
	}

	public delete(album: Album): Observable<boolean> {
		const sql = `DELETE FROM albums WHERE id == $albumId`;
		const values = {$albumId: album.id};

		return DatabaseService.delete(sql, values).pipe(
			map(() => true)
		);
	}

}
