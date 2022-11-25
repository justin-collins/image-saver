import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { TagFilter } from 'src/app/core/services';

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
			debounceTime(500)
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

		this.searchControl.setValue(this.filters.term);
		this.filtersChanged();
	}

	public resetFilters(): void {
		this.filters = {
			term: ''
		};
		this.filtersChanged();
	}
}
