import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from './tag';
import { DatabaseService } from './database.service';
import { map } from 'rxjs/operators';
import { Media } from './media';

@Injectable({
	providedIn: 'root'
})
export class TagService {

	constructor() { }

	public getAll(): Observable<Tag[]> {
		const sql = `SELECT tags.id, tags.title, tags.created_at, COUNT(*) as total FROM tags
					LEFT JOIN mediaTagsMap on mediaTagsMap.tag_id == tags.id
					GROUP BY tags.id
					ORDER BY tags.title ASC;
		`;
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
}
