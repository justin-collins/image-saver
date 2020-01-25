import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from './tag';
import { DatabaseService } from './database.service';
import { map } from 'rxjs/operators';
import { Media } from './media';

export interface TagFilter {
	term?: string;
}

@Injectable({
	providedIn: 'root'
})
export class TagService {

	constructor() { }

	public getAll(): Observable<Tag[]> {
		const sql = `SELECT tags.id, tags.title, tags.created_at, COUNT(*) as total FROM tags
					LEFT JOIN mediaTagsMap on mediaTagsMap.tag_id == tags.id
					GROUP BY tags.id
					ORDER BY total DESC`;
		const values = {};

		return DatabaseService.selectAll(sql, values).pipe(
			map((rows) => {
				const tags: Tag[] = [];
				for (const row of rows) {
					tags.push(new Tag().fromRow(row));
				}
				return tags;
			})
		);
	}

	public getFiltered(filter: TagFilter): Observable<Tag[]> {
		let sql = `SELECT tags.id, tags.title, tags.created_at, COUNT(*) as total FROM tags
					LEFT JOIN mediaTagsMap on mediaTagsMap.tag_id == tags.id`;

		if (filter.term) sql += ` WHERE tags.title LIKE "%${filter.term}%"`;

		sql += ` GROUP BY tags.id
				ORDER BY total DESC`;

		const values = {};

		return DatabaseService.selectAll(sql, values).pipe(
			map((rows) => {
				const tags: Tag[] = [];
				for (const row of rows) {
					tags.push(new Tag().fromRow(row));
				}
				return tags;
			})
		);
	}

	public insert(tag: Tag): Observable<Tag> {
		const sql = `INSERT INTO tags (title) VALUES ($title)`;
		const values = { $title: tag.title.toLowerCase() };

		return DatabaseService.insert(sql, values).pipe(
			map((result) => {
				tag.id = result.lastID;
				return tag;
			})
		);
	}

	public getTagsByMedia(media: Media): Observable<Tag[]> {
		const sql = `SELECT tags.id, tags.title, tags.created_at from mediaTagsMap
					LEFT JOIN tags on tags.id == mediaTagsMap.tag_id
					WHERE mediaTagsMap.media_id == $mediaId ORDER BY tags.title ASC;`;
		const values = {$mediaId: media.id};

		return DatabaseService.selectAll(sql, values).pipe(
			map((rows) => {
				const tags: Tag[] = [];
				for (const row of rows) {
					tags.push(new Tag().fromRow(row));
				}
				return tags;
			})
		);
	}

	public removeFromMedia(media: Media, tag: Tag): Observable<Tag> {
		const sql = `DELETE FROM mediaTagsMap WHERE tag_id == $tagId AND media_id == $mediaId`;
		const values = { $tagId: tag.id, $mediaId: media.id };

		return DatabaseService.update(sql, values).pipe(
			map(() => tag)
		);
	}

	public addToMedia(media: Media, tag: Tag): Observable<Tag> {
		const sql = `INSERT INTO mediaTagsMap (media_id, tag_id) VALUES ($mediaId, $tagId) ON CONFLICT(media_id, tag_id) DO UPDATE SET tag_id = $tagId`;
		const values = { $tagId: tag.id, $mediaId: media.id };

		return DatabaseService.update(sql, values).pipe(
			map(() => tag)
		);
	}

	public addBulkToMedia(media: Media, tags: Tag[]): Observable<Tag[]> {
		let sql = `INSERT INTO mediaTagsMap (media_id, tag_id) VALUES`;

		for (let i = 0; i < tags.length; i++) {
			sql += `(${media.id}, ${tags[i].id})`

			if (i < tags.length - 1) sql += `,`;
		}

		sql += ` ON CONFLICT(media_id, tag_id) DO UPDATE SET media_id = ${media.id}`;
		const values = {};

		return DatabaseService.update(sql, values).pipe(
			map(() => tags)
		);
	}

	public delete(tag: Tag): Observable<Tag> {
		const sql = `DELETE FROM tags WHERE tags.id == $tagId`;
		const values = { $tagId: tag.id };

		return DatabaseService.delete(sql, values).pipe(
			map(() => tag)
		);
	}
}
