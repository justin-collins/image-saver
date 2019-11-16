import { MediaType } from "./mediaType";
import { MediaLocation } from './mediaLocation';

export class Media {
	public id: number;
	public title: string;
	public url: string;
	public source: string;
	public type: MediaType;
	public location: MediaLocation;
	public trashed: Boolean;
	public createdAt: Date;
	public trashedAt: Date;

	public fromRow(row: object): Media {
        this.id = row['id'];
        this.title = row['title'];
        this.url = row['url'];
		this.source = row['source'];
		this.type = row['type'];
		this.location = row['location'];
		this.trashed = row['trashed'];
		this.createdAt = new Date(row['created_at'] + 'Z');
		this.trashedAt = new Date(row['trashed_at'] + 'Z');

        return this;
    }
}
