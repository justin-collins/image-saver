import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AlbumFilter } from '../../core/services';

enum AlbumOrderBy {
	CREATEDAT ='created_at',
	TITLE = 'title'
}

@Component({
	selector: 'isvr-album-filters',
	templateUrl: './album-filters.component.html',
	styleUrls: ['./album-filters.component.scss']
})
export class AlbumFiltersComponent implements OnInit {
	@Output() onFiltersChanged = new EventEmitter<AlbumFilter>();

	public filters: AlbumFilter;
	public searchControl: FormControl = new FormControl();
	public orderByTypes = AlbumOrderBy;

	constructor() {
		this.resetFilters();
	}

	ngOnInit() {
		this.setupSearchInput();
	}

	private setupSearchInput(): void {
		this.searchControl.valueChanges.pipe(
			debounceTime(300)
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
			term: '',
			orderBy: AlbumOrderBy.CREATEDAT
		};
		this.filtersChanged();
	}
}
