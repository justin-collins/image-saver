import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { Media } from '../types/media';
import { DatabaseService } from './database.service';
import { map, flatMap } from 'rxjs/operators';
import { MediaType } from '../types/mediaType';
import { MediaLocation } from '../types/mediaLocation';
import { Tag } from '../types/tag';
import { TagService } from './tag.service';
import { MediaFilter } from '../types/mediaFilter';
import { MediaSortBy } from '../types/mediaSortBy';
import { Context } from '../types/context';
import { ContextType } from '../types/contextType';
import { ContextService } from './context.service';

@Injectable({
	providedIn: 'root'
})
export class MediaService {

	constructor(private tagService: TagService,
				private contextService: ContextService) { }

	public getAll(): Observable<Media[]> {
		return this.getBulk(false);
	}

	public getTrashed(): Observable<Media[]> {
		return this.getBulk(true);
	}

	private getBulk(trashed: boolean = false): Observable<Media[]> {
		const sql = `SELECT * FROM media WHERE trashed == $trashed ORDER BY created_at DESC`;
		const values = {$trashed: trashed};

		return this.databaseSelectAll(sql, values);
	}

	public getMediaByContext(context: Context): Observable<Media[]> {
		if (!context) return null;
		
		if (context.type === ContextType.SEARCH) {
			return this.getFiltered(<MediaFilter>context.dataObject);
		} else if (context.type === ContextType.ALBUM) {
			return this.getByAlbumId(context.dataObject['id']);
		}
	}

	public getFiltered(filter: MediaFilter): Observable<Media[]> {
		let sql = `SELECT distinct media.* FROM media`;

		if (filter.term) {
			sql += ` LEFT JOIN mediaTagsMap ON mediaTagsMap.media_id == media.id
					LEFT JOIN tags ON tags.id == mediaTagsMap.tag_id`;
		}

		sql += this.buildFilteredByTagSql(filter, 'media');
		
		sql += ` WHERE media.trashed == 0`;

		if (filter.term) {
			sql += ` AND (tags.title LIKE "%${filter.term}%" OR media.title LIKE "%${filter.term}%" OR media.url LIKE "%${filter.term}%")`;
		}

		if (filter.type) sql += ` AND media.type == "${filter.type}"`;
		if (filter.location) sql += ` AND media.location == "${filter.location}"`;

		sql += this.buildFilteredSortBySql(filter, 'media');

		const values = {};

		return this.databaseSelectAll(sql, values);
	}

	private buildFilteredByTagSql(filter: MediaFilter, mediaTableName: string): string {
		if (!filter.tags || filter.tags.length === 0) return '';

		let sql = ``;
		const maximumLoops = 24;
		let lastLetter: string = 'a';

		for (let i = 0; (i < filter.tags.length && i < maximumLoops); i++) {
			let mediaTagsMapName: string = String.fromCharCode(lastLetter.charCodeAt(0) + 1);
			let tagsName: string = String.fromCharCode(lastLetter.charCodeAt(0) + 2);
			lastLetter = tagsName;
			
			const tag: Tag = filter.tags[i];
			sql += ` INNER JOIN mediaTagsMap ${mediaTagsMapName} ON ${mediaTagsMapName}.media_id == ${mediaTableName}.id`;
			sql += ` INNER JOIN tags ${tagsName} ON (${tagsName}.id == ${mediaTagsMapName}.tag_id AND ${tagsName}.id == ${tag.id})`;
		}

		return sql;
	}

	private buildFilteredSortBySql(filter: MediaFilter, mediaTableName: string): string {
		let sql = ``;

		if (!filter.sortBy || filter.sortBy === MediaSortBy.DATE) sql += ` ORDER BY ${mediaTableName}.created_at DESC`;
		else if (filter.sortBy && filter.sortBy === MediaSortBy.NAME) sql += ` ORDER BY ${mediaTableName}.title COLLATE NOCASE ASC`;
		else if (filter.sortBy && filter.sortBy === MediaSortBy.SHUFFLE) sql += ` ORDER BY random()`;

		return sql;
	}

	public getByAlbumId(albumId: number, exclude?: boolean): Observable<Media[]> {
		let sql = `SELECT media.*`;
		if (!exclude) {
			sql += ` FROM mediaAlbumsMap INNER JOIN media ON media.id == mediaAlbumsMap.media_id WHERE mediaAlbumsMap.album_id == $albumId `;
		} else {
			sql += ` FROM media WHERE media.id NOT IN (SELECT mediaAlbumsMap.media_id from mediaAlbumsMap WHERE mediaAlbumsMap.album_id == $albumId) `;
		}
		sql += `AND media.trashed == 0 ORDER BY media.created_at DESC;`;

		const values = { $albumId: albumId };

		return this.databaseSelectAll(sql, values);
	}

	public get(id: number): Observable<Media> {
		const sql = `SELECT * FROM media WHERE id = $id`;
		const values = { $id: id };

		return DatabaseService.selectOne(sql, values).pipe(
			map((row) => new Media().fromRow(row))
		);
	}

	public insertWithTags(media: Media[], tags?: Tag[]): Observable<Media[]> {
		if (tags) {
			let inserts = [];
			for (let i = 0; i < media.length; i++) {
				const theMedia = media[i];
				inserts.push(this.insertSingle(theMedia).pipe(
					flatMap((response) => this.tagService.addBulkToMedia(response, tags).pipe(
						map(() => response)
					))
				));
			}

			return forkJoin<Media[]>(inserts);
		} else {
			return this.insert(media);
		}
	}

	public insert(media: Media[]): Observable<Media[]> {
		let inserts = [];
		for (let i = 0; i < media.length; i++) {
			const theMedia = media[i];
			inserts.push(this.insertSingle(theMedia));
		}

		return forkJoin<Media[]>(inserts);
	}

	private insertSingle(media: Media): Observable<Media> {
		this.validate(media);

		media = this.prepareMediaForInsert(media);
		const sql = `INSERT INTO media (title, url, source, type, location) VALUES ($title, $url, $source, $type, $location) ON CONFLICT(url) DO UPDATE SET id = id`;
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

	public rotate(media: Media, rotationDeg: number): Observable<Media> {
		const sql = `UPDATE media SET rotation = $rotation WHERE id == $mediaId`;
		const values = {$rotation: rotationDeg, $mediaId: media.id};

		return DatabaseService.update(sql, values).pipe(
			map(() => {
				media.rotation = rotationDeg;
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

	private databaseSelectAll(sql: string, values: Object): Observable<Media[]> {
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

	private validate(media: Media): void {
		if (media.source.indexOf('http://') === -1 && media.source.indexOf('https://') === -1 && media.source.indexOf('media://') === -1) {
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
		else console.error(`Unknown file extension: ${mediaURL}`);
	}

	private inferLocationFromUrl(mediaUrl: string): MediaLocation {
		if(mediaUrl.indexOf('http://') > -1 || mediaUrl.indexOf('https://') > -1) {
			return MediaLocation.REMOTE;
		} else if (mediaUrl.indexOf('media://') > -1) {
			return MediaLocation.LOCAL;
		}

		return null;
	}

	private urlIsImage(url: string): boolean {
		let match = url.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:jpe?g|JPE?G|png|bmp|webp))(?:\?([^#]*))?(?:#(.*))?/);
		return (match && match.length > 0) ? true : false;
	}

	private urlIsGif(url: string): boolean {
		let match = url.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:gif|gifv))(?:\?([^#]*))?(?:#(.*))?/);
		return (match && match.length > 0) ? true : false;
	}

	private urlIsVideo(url: string): boolean {
		let match = url.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:mp4|webm|ogg|m4v|mkv|mpg|mpeg|mov|avi))(?:\?([^#]*))?(?:#(.*))?/);
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
