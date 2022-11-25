import { Component, OnInit, Output, EventEmitter, NgZone, Input } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Tag } from '../../core/types';
import { MessagingService, TagService } from '../../core/services';

@Component({
	selector: 'isvr-tag-autocomplete',
	templateUrl: './tag-autocomplete.component.html',
	styleUrls: ['./tag-autocomplete.component.scss']
})
export class TagAutocompleteComponent implements OnInit {
	@Input() newTagAllowed: boolean = false;
	@Input() placeholder = 'Type Tag Name Here';
	@Output() tagChosen = new EventEmitter<Tag>();

	public newTagControl = new FormControl();
	public allTags: Tag[];
	public filteredAllTags: Observable<Tag[]>;

	constructor(private tagService: TagService,
		private messagingService: MessagingService,
		private _ngZone: NgZone) {}

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
		if (typeof event.option.value === 'string') {
			this.createNewTag(event.option.value);
			return;
		}

		this.resetAutocomplete();
		let selectedTag: Tag = event.option.value;
		this.emitTagChosen(selectedTag);
	}

	private createNewTag(newTagTitle: string): void {
		let newTag: Tag = new Tag();
		newTag.title = newTagTitle;

		this.tagService.insert(newTag).subscribe(this.newTagCreated);
	}

	private newTagCreated = (response: Tag): void => {
		this._ngZone.run(() => {
			this.messagingService.message('New Tag Created!');
			this.allTags.push(response);
			this.resetAutocomplete();
			this.emitTagChosen(response);
		});
	}

	private emitTagChosen(newTag: Tag): void {
		if (!newTag) return;

		this.tagChosen.emit(newTag);
	}

	public stopPropagation(event): void {
		event.stopPropagation();
	}
}
