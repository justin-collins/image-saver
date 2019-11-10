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
		this.cover.title = row['media_title'];
		this.cover.url = row['url'];
		this.cover.type = row['type'];

        return this;
    }
}
