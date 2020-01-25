import { Component, OnInit, NgZone } from '@angular/core';
import { TagService, TagFilter } from '../core/tag.service';
import { Tag } from '../core/tag';

@Component({
	selector: 'isvr-tags',
	templateUrl: './tags.component.html',
	styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
	public tags: Tag[];
	public filters: TagFilter;

	constructor(private tagService: TagService,
				private _ngZone: NgZone) {
		this.resetFilters()
	}

	ngOnInit() {
		this.loadTags(this.filters);
	}

	private loadTags(newFilter: TagFilter): void {
		this.tagService.getFiltered(newFilter).subscribe(this.tagsLoaded);
	}

	private tagsLoaded = (tagsResponse: Tag[]): void => {
		this._ngZone.run(() => {
			this.tags = tagsResponse;
		});
	}

	public filtersChanged(newFilters: TagFilter): void {
		this.filters = newFilters;
		this.loadTags(this.filters);
	}


	public searchByTag(tag: Tag): void {

	}

	public newTagAdded(newTag: Tag): void {
		this._ngZone.run(() => {
			this.tags.unshift(newTag);
		});
	}

	public permanentlyDelete(tag: Tag): void {
		this.tagService.delete(tag).subscribe(() => this.removeTagFromList(tag));
	}

	private removeTagFromList = (tag: Tag): void => {
		let index: number = this.tags.findIndex(t => t.id === tag.id);

		if (index > -1) {
			this._ngZone.run(() => {
				this.tags.splice(index, 1);
			});
		}
	}

	public preventDefault(event): void {
		event.preventDefault();
		event.stopPropagation();
	}

	private resetFilters(): void {
		this.filters = {
			term: ''
		};
	}
}
