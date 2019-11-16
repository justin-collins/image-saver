import { Media } from './media';

export class Album {
	public id: number;
	public title: string;
	public cover: Media;
	public createdAt: Date;

	public fromRow(row: object): Album {
        this.id = row['id'];
        this.title = row['title'];
		this.createdAt = new Date(row['created_at'] + 'Z');

		this.cover = new Media();
		this.cover.id = row['media_id'];
		this.cover.url = row['media_url'];
		this.cover.type = row['media_type'];

        return this;
    }
}
