import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Media } from './media';
import { DatabaseService } from './database.service';
import { map } from 'rxjs/operators';
import { MediaType } from './mediaType';
import { MediaLocation } from './mediaLocation';

@Injectable({
	providedIn: 'root'
})
export class MediaService {

	constructor() { }

	public getAll(): Observable<Media[]> {
		return this.getBulk(false);
	}

	public getTrashed(): Observable<Media[]> {
		return this.getBulk(true);
	}

	private getBulk(trashed: boolean = false): Observable<Media[]> {
		const sql = `SELECT * FROM media WHERE trashed == $trashed ORDER BY created_at DESC`;
		const values = {$trashed: trashed};

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

	public getByAlbumId(albumId: number, exclude?: boolean): Observable<Media[]> {
		let sql = `SELECT media.id, media.title, media.type, media.url`;
		if (!exclude) {
			sql += ` FROM mediaAlbumsMap INNER JOIN media ON media.id == mediaAlbumsMap.media_id WHERE mediaAlbumsMap.album_id == $albumId `;
		} else {
			sql += ` FROM media WHERE media.id NOT IN (SELECT mediaAlbumsMap.media_id from mediaAlbumsMap WHERE mediaAlbumsMap.album_id == $albumId) `;
		}
		sql += `AND media.trashed == 0 ORDER BY media.created_at DESC;`;

		const values = { $albumId: albumId };

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
		const sql = `SELECT * FROM media WHERE id = $id`;
		const values = { $id: id };

		return DatabaseService.selectOne(sql, values).pipe(
			map((row) => new Media().fromRow(row))
		);
	}

	public insert(media: Media | Media[]): Observable<Media | Media[]> {
		if (media instanceof Array) {
			return this.insertMany(media);
		} else {
			return this.insertSingle(media);
		}
	}

	private insertMany(media: Media[]): Observable<Media[]> {
		let inserts = [];
		for (let i = 0; i < media.length; i++) {
			const theMedia = media[i];
			inserts.push(this.insertSingle(theMedia));
		}

		return forkJoin<Media>(inserts);
	}

	private insertSingle(media: Media): Observable<Media> {
		this.validate(media);

		media = this.prepareMediaForInsert(media);
		const sql = `INSERT INTO media (title, url, source, type, location) VALUES ($title, $url, $source, $type, $location)`;
		const values = { $title: media.title, $url: media.url, $source: media.source, $type: media.type, $location: media.location };

		return DatabaseService.insert(sql, values).pipe(
			map((result) => {
				media.id = result.lastID;
				return media;
			})
		);
	}

	public trash(media: Media): Observable<Media> {
		return this.changeTrashed(media, true);
	}

	public restore(media: Media): Observable<Media> {
		return this.changeTrashed(media, false);
	}

	private changeTrashed(media: Media, trashed: boolean): Observable<Media> {
		let trashedAtValue = (trashed)? 'CURRENT_TIMESTAMP' : 'NULL';
		const sql = `UPDATE media SET trashed = $trashed, trashed_at = ${trashedAtValue} WHERE id == $mediaId`;
		const values = {$trashed: trashed, $mediaId: media.id};

		return DatabaseService.update(sql, values).pipe(
			map(() => {
				media.trashed = trashed;
				return media;
			})
		);
	}

	public delete(media: Media): Observable<boolean> {
		const sql = `DELETE from media WHERE id == $mediaId`;
		const values = {$mediaId: media.id};

		return DatabaseService.delete(sql, values).pipe(
			map(() => true)
		);
	}

	public deleteAllTrashed(): Observable<boolean> {
		const sql = `DELETE from media WHERE trashed == 1`;
		const values = {};

		return DatabaseService.delete(sql, values).pipe(
			map(() => true)
		);
	}

	private validate(media: Media): void {
		if (media.source.indexOf('http://') === -1 && media.source.indexOf('https://') === -1 && media.source.indexOf('file://') === -1) {
			console.error('a protocol is required for a media source');
		}
	}

	private prepareMediaForInsert(media: Media): Media {
		if (!media.url) media.url = this.inferMediaUrlFromSource(media.source);
		if (!media.type) media.type = this.inferTypeFromUrl(media.url);
		if (!media.title) media.title = this.inferTitleFromUrl(media.url);
		if (!media.location) media.location = this.inferLocationFromUrl(media.url);

		return media;
	}

	private inferMediaUrlFromSource(mediaSource: string): string {
		//placeholder for eventual more-complex url parsers
		return mediaSource;
	}

	private inferTypeFromUrl(mediaURL: string): MediaType {
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

	private inferLocationFromUrl(mediaUrl: string): MediaLocation {
		if(mediaUrl.indexOf('http://') > -1 || mediaUrl.indexOf('https://') > -1) {
			return MediaLocation.REMOTE;
		} else if (mediaUrl.indexOf('file://') > -1) {
			return MediaLocation.LOCAL;
		}

		return null;
	}

	private urlIsImage(url: string): boolean {
		let match = url.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:jpe?g|gif|png|bmp))(?:\?([^#]*))?(?:#(.*))?/);
		return (match && match.length > 0) ? true : false;
	}

	private urlIsGif(url: string): boolean {
		let match = url.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:gif|gifv))(?:\?([^#]*))?(?:#(.*))?/);
		return (match && match.length > 0) ? true : false;
	}

	private urlIsVideo(url: string): boolean {
		let match = url.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:mp4|webm))(?:\?([^#]*))?(?:#(.*))?/);
		return (match && match.length > 0) ? true : false;
	}

	private urlIsAudio(url: string): boolean {
		let match = url.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:mp3))(?:\?([^#]*))?(?:#(.*))?/);
		return (match && match.length > 0) ? true : false;
	}

	public inferTitleFromUrl(mediaURL: string): string {
		if (!mediaURL) return '';

		let match = mediaURL.match(/[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/);
		return (match && match.length > 0) ? match[0] : '';
	}
}
