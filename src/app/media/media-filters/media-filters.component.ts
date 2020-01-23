import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MediaFilter } from 'src/app/core/media.service';
import { MediaType } from 'src/app/core/mediaType';
import { MediaLocation } from 'src/app/core/mediaLocation';
import { debounceTime, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'isvr-media-filters',
	templateUrl: './media-filters.component.html',
	styleUrls: ['./media-filters.component.scss']
})
export class MediaFiltersComponent implements OnInit {
	@Output() onFiltersChanged = new EventEmitter<MediaFilter>();

	public filters: MediaFilter;
	public mediaTypes: MediaType[] = Object.keys(MediaType).map(type => MediaType[type]);
	public mediaLocations: MediaLocation[] = Object.keys(MediaLocation).map(location => MediaLocation[location]);

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

	public clearType(): void {
		this.filters.type = null;
		this.filtersChanged();
	}

	public clearLocation(): void {
		this.filters.location = null;
		this.filtersChanged();
	}

	public resetFilters(): void {
		this.filters = {
			term: '',
			type: null,
			location: null
		};
		this.filtersChanged();
	}
}
