import { Component, OnInit, Input, NgZone, Output, EventEmitter } from '@angular/core';
import { Media, Tag } from '../../core/types';
import { TagService } from '../../core/services';

@Component({
	selector: 'isvr-tag-manager',
	templateUrl: './tag-manager.component.html',
	styleUrls: ['./tag-manager.component.scss']
})
export class TagManagerComponent implements OnInit {
	@Input() disabled: boolean = false;
	@Input() newTagAllowed: boolean = false;
	@Input() label: string = '';
	@Input() displayType: 'button' | 'input' = 'button';
	@Input() placeholder = 'Type Tag Name Here';

	private _media: Media;
    @Input() set media(value: Media) {
       this._media = value;
       this.loadMediaTags();
    }
    get media(): Media { return this._media; }

	@Output() tagsChanged = new EventEmitter<Tag[]>();

	public tags: Tag[];
	public newTag: boolean = false;

	constructor(private tagService: TagService,
		private _ngZone: NgZone) { }

	ngOnInit() {
		if (!this.media) {
			this.tags = [];
		}
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
		if (this.newTagAllowed) {
			this.tagService.removeFromMedia(this.media, tag).subscribe(this.tagRemoved);
		} else {
			this.tagRemoved(tag);
		}
	}

	private tagRemoved = (removeTag: Tag): void => {
		this._ngZone.run(() => {
			let index: number = this.tags.findIndex(tag => tag.id === removeTag.id);

			if (index > -1) this.tags.splice(index, 1);
			this.updateTagsOutput();
		});
	}

	public showNewTag(): void {
		this.newTag = true;
	}

	public hideNewTag(): void {
		this.newTag = false;
	}

	public addNewTag(selectedTag: Tag): void {
		if (this.tagsContains(selectedTag)) return;

		if (this.media && this.media.id && this.newTagAllowed) {
			this.tagService.addToMedia(this.media, selectedTag).subscribe(this.tagAdded);
		} else {
			this.tagAdded(selectedTag);
		}
	}

	private tagAdded = (tagResponse: Tag): void => {
		this._ngZone.run(() => {
			this.tags.push(tagResponse);
			this.updateTagsOutput();
		});
	}

	public tagsContains(tag: Tag): boolean {
		let containingTag: Tag = this.tags.filter(option => option.id === tag.id)[0];
		return (containingTag)? true : false;
	}

	private updateTagsOutput(): void {
		this.tagsChanged.emit(this.tags);
	}
}
