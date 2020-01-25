import { Component, OnInit } from '@angular/core';
import { MediaFilter } from 'src/app/core/media.service';
import { MediaType } from 'src/app/core/mediaType';
import { MediaLocation } from 'src/app/core/mediaLocation';
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ContextService } from 'src/app/core/context.service';
import { Context } from 'src/app/core/context';
import { ContextType } from 'src/app/core/contextType';

@Component({
	selector: 'isvr-media-filters',
	templateUrl: './media-filters.component.html',
	styleUrls: ['./media-filters.component.scss']
})
export class MediaFiltersComponent implements OnInit {
	public filters: MediaFilter;
	public mediaTypes: MediaType[] = Object.keys(MediaType).map(type => MediaType[type]);
	public mediaLocations: MediaLocation[] = Object.keys(MediaLocation).map(location => MediaLocation[location]);

	public searchControl: FormControl = new FormControl();
	public context: Context;

	constructor(private contextService: ContextService) {
		this.filters = this.emptyFilter();
	}

	ngOnInit() {
		this.setupSearchInput();
		this.contextService.contextChanged.subscribe(this.contextChanged);
	}

	private setupSearchInput(): void {
		this.searchControl.valueChanges.pipe(
			debounceTime(300)
		).subscribe(this.filterBySearch);

	}

	private contextChanged = (newContext: Context): void => {
		this.context = newContext;
		if (this.context) this.handleContext(this.context);
	}

	private handleContext(context: Context): void {
		if (context.type === ContextType.TAG) {
			if (this.searchControl.value !== context.dataObject['title'] && context.dataObject['title'] !== '') {
				this.searchControl.setValue(context.dataObject['title']);
			}
		} else if (context.type === ContextType.SEARCH) {
			if (this.searchControl.value !== context.dataObject['term']&& context.dataObject['term'] !== '') {
				this.searchControl.setValue(context.dataObject['term']);
			}
		}
	}

	private filterBySearch = (newTerm: string): void => {
		this.filters.term = newTerm;
		this.filtersChanged();
	}

	public filtersChanged(): void {
		if (!this.filtersAreEmpty()) {
			this.contextService.setContextSearch(this.filters);
		} else {
			this.contextService.resetContext();
		}
	}

	public clearTerm(): void {
		this.filters.term = '';

		this.searchControl.setValue(this.filters.term);
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

	private emptyFilter(): MediaFilter {
		return {
			term: '',
			type: null,
			location: null
		};
	}

	public resetFilters(): void {
		this.filters = this.emptyFilter();
		this.searchControl.setValue(this.filters.term);
	}

	private filtersAreEmpty(): boolean {
		if (this.filters.term || this.filters.type || this.filters.location) return false;
		return true;
	}
}
