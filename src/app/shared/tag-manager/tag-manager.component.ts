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

	constructor(private tagService: TagService,
		private _ngZone: NgZone) { }

	ngOnInit() {
		this.loadTags();
	}

	private loadTags(): void {
		this.tagService.getTagsByMedia(this.media).subscribe(this.tagsLoaded);
	}

	private tagsLoaded = (tagsResponse: Tag[]): void => {
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
}
