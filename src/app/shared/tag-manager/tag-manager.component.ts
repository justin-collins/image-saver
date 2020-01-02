import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Tag } from 'src/app/core/tag';
import { Media } from 'src/app/core/media';
import { TagService } from 'src/app/core/tag.service';

@Component({
	selector: 'isvr-tag-manager',
	templateUrl: './tag-manager.component.html',
	styleUrls: ['./tag-manager.component.scss']
})
export class TagManagerComponent implements OnInit {
	@Input() media: Media;

	public tags: Tag[];
	public newTag: boolean = false;

	constructor(private tagService: TagService,
		private _ngZone: NgZone) { }

	ngOnInit() {
		this.loadMediaTags();
	}

	private loadMediaTags(): void {
		this.tagService.getTagsByMedia(this.media).subscribe(this.mediaTagsLoaded);
	}

	private mediaTagsLoaded = (tagsResponse: Tag[]): void => {
		this._ngZone.run(() => {
			this.tags = tagsResponse;
		});
	}

	public removeTag(tag: Tag): void {
		this.tagService.removeFromMedia(this.media, tag).subscribe(this.tagRemoved);
	}

	private tagRemoved = (removeTag: Tag): void => {
		this._ngZone.run(() => {
			let index: number = this.tags.findIndex(tag => tag.id === removeTag.id);

			if (index > -1) this.tags.splice(index, 1);
		});
	}

	public showNewTag(): void {
		this.newTag = true;
	}

	public hideNewTag(): void {
		this.newTag = false;
	}

	public addNewTag(selectedTag: Tag): void {
		if (this.tagsContains(selectedTag)) {
			return;
		}

		this.tagService.addToMedia(this.media, selectedTag).subscribe(this.tagAdded);
	}

	private tagAdded = (tagResponse: Tag): void => {
		this._ngZone.run(() => {
			this.tags.push(tagResponse);
		});
	}

	public tagsContains(tag: Tag): boolean {
		let containingTag: Tag = this.tags.filter(option => option.id === tag.id)[0];
		return (containingTag)? true : false;
	}
}
