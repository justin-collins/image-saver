import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Tag } from 'src/app/core/tag';
import { Media } from 'src/app/core/media';
import { TagService } from 'src/app/core/tag.service';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
	selector: 'isvr-tag-manager',
	templateUrl: './tag-manager.component.html',
	styleUrls: ['./tag-manager.component.scss']
})
export class TagManagerComponent implements OnInit {
	@Input() media: Media;

	public newTagControl = new FormControl();

	public tags: Tag[];
	public allTags: Tag[];
	public filteredAllTags: Observable<Tag[]>;
	public newTag: Tag;

	constructor(private tagService: TagService,
		private _ngZone: NgZone) { }

	ngOnInit() {
		this.loadMediaTags();
		this.loadAllTags();
	}

	private loadMediaTags(): void {
		this.tagService.getTagsByMedia(this.media).subscribe(this.mediaTagsLoaded);
	}

	private mediaTagsLoaded = (tagsResponse: Tag[]): void => {
		this._ngZone.run(() => {
			this.tags = tagsResponse;
		});
	}

	private loadAllTags(): void {
		this.tagService.getAll().subscribe(this.allTagsLoaded);
	}

	private allTagsLoaded = (tagsResponse: Tag[]): void => {
		this.allTags = tagsResponse;
		this.setupAutocomplete();
	}

	private setupAutocomplete(): void {
		this.filteredAllTags = this.newTagControl.valueChanges.pipe(
			startWith(''),
			map(value => this._filter(value))
		);
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
		this.newTag = new Tag();
	}

	public hideNewTag(): void {
		this.resetAutocomplete();
		this.newTag = null;
	}

	public addNewTag(event: MatAutocompleteSelectedEvent): void {
		let selectedTag: Tag = event.option.value;

		if (this.tagsContains(selectedTag)) {
			this.resetAutocomplete();
			return;
		}

		this.tagService.addToMedia(this.media, selectedTag).subscribe(this.tagAdded);
	}

	private tagAdded = (tagResponse: Tag): void => {
		this._ngZone.run(() => {
			this.tags.push(tagResponse);
			this.resetAutocomplete();
		});
	}

	public tagsContains(tag: Tag): boolean {
		let containingTag: Tag = this.tags.filter(option => option.id === tag.id)[0];
		return (containingTag)? true : false;
	}

	private resetAutocomplete(): void {
		this.newTagControl.setValue('');
	}

	public autocompleteDisplay(tag?: Tag): string | undefined {
		return tag ? tag.title : undefined;
	}

	private _filter(value): Tag[] {
		const filterValue = (value.title)? value.title.toLowerCase() : value.toLowerCase();

		return this.allTags.filter(option => option.title.toLowerCase().includes(filterValue));
	}
}
