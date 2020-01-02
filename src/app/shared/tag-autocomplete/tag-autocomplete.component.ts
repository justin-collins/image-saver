import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Tag } from 'src/app/core/tag';
import { Observable } from 'rxjs';
import { TagService } from 'src/app/core/tag.service';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
	selector: 'isvr-tag-autocomplete',
	templateUrl: './tag-autocomplete.component.html',
	styleUrls: ['./tag-autocomplete.component.scss']
})
export class TagAutocompleteComponent implements OnInit {
	@Output() tagChosen = new EventEmitter<Tag>();

	public newTagControl = new FormControl();
	public allTags: Tag[];
	public filteredAllTags: Observable<Tag[]>;

	constructor(private tagService: TagService) { }

	ngOnInit() {
		this.loadAllTags();
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

	public autocompleteOptionChosen(event: MatAutocompleteSelectedEvent): void {
		let selectedTag: Tag = event.option.value;
		this.emitTagChosen(selectedTag);
	}

	private emitTagChosen(newTag: Tag): void {
		this.tagChosen.emit(newTag);
	}
}
