import { Component, OnInit, NgZone } from '@angular/core';
import { TagService } from '../core/tag.service';
import { Tag } from '../core/tag';

@Component({
	selector: 'isvr-tags',
	templateUrl: './tags.component.html',
	styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
	public tags: Tag[];

	constructor(private tagService: TagService,
				private _ngZone: NgZone) { }

	ngOnInit() {
		this.loadAllTags();
	}

	private loadAllTags(): void {
		this.tagService.getAll().subscribe(this.tagsLoaded);
	}

	private tagsLoaded = (tagsResponse: Tag[]): void => {
		this._ngZone.run(() => {
			this.tags = tagsResponse;
		});
	}

	public searchByTag(tag: Tag): void {

	}

	public newTagAdded(newTag: Tag): void {
		this._ngZone.run(() => {
			this.tags.unshift(newTag);
		});
	}
}
