import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, startWith } from 'rxjs/operators';
import { TagFilter } from 'src/app/core/tag.service';

enum TagOrderBy {
	CREATEDAT ='created_at',
	TITLE = 'title'
}

@Component({
  selector: 'isvr-tag-filters',
  templateUrl: './tag-filters.component.html',
  styleUrls: ['./tag-filters.component.scss']
})
export class TagFiltersComponent implements OnInit {
	@Output() onFiltersChanged = new EventEmitter<TagFilter>();

	public filters: TagFilter;
	public searchControl: FormControl = new FormControl();

	constructor() {
		this.resetFilters();
	}

	ngOnInit() {
		this.setupSearchInput();
	}

	private setupSearchInput(): void {
		this.searchControl.valueChanges.pipe(
			debounceTime(300),
			startWith('')
		).subscribe(this.filterBySearch);
	}

	private filterBySearch = (newTerm: string): void => {
		this.filters.term = newTerm;
		this.filtersChanged();
	}

	public filtersChanged(): void {
		this.onFiltersChanged.emit(this.filters);
	}

	public clearTerm(): void {
		this.filters.term = '';
		this.filtersChanged();
	}

	public resetFilters(): void {
		this.filters = {
			term: ''
		};
		this.filtersChanged();
	}

}
