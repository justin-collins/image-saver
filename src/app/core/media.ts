import { MediaType } from "./mediaType";

export class Media {
	public id: number;
	public title: string;
	public url: string;
	public type: MediaType;

	public fromRow(row: object): Media {
        this.id = row['id'];
        this.title = row['title'];
        this.url = row['url'];
        this.type = row['type'];

        return this;
    }
}
