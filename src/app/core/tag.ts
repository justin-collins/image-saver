export class Tag {
	public id: number;
	public title: string;
	public total: number;
	public createdAt: Date;

	public fromRow(row: object): Tag {
        this.id = row['id'];
        this.title = row['title'];
        this.total = row['total'];
		this.createdAt = new Date(row['created_at'] + 'Z');

        return this;
    }
}
