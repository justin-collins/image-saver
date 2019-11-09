import { MediaType } from "./mediaType";

export class Media {
	public id: number;
	public title: string;
	public url: string;
	public type: MediaType;
	public trashed: Boolean;
	public createdAt: Date;
	public trashedAt: Date;

	public fromRow(row: object): Media {
        this.id = row['id'];
        this.title = row['title'];
        this.url = row['url'];
		this.type = row['type'];
		this.trashed = row['trashed'];
		this.createdAt = new Date(row['created_at'] + 'Z');
		this.trashedAt = new Date(row['trashed_at'] + 'Z');

        return this;
    }
}
