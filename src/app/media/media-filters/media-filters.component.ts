import { Component, NgZone, OnInit } from '@angular/core';
import { MediaType } from 'src/app/core/types/mediaType';
import { MediaLocation } from 'src/app/core/types/mediaLocation';
import { debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ContextService } from 'src/app/core/services/context.service';
import { Context } from 'src/app/core/types/context';
import { ContextType } from 'src/app/core/types/contextType';
import { MediaFilter } from 'src/app/core/types/mediaFilter';
import { MediaSortBy } from 'src/app/core/types/mediaSortBy';
import { Tag } from 'src/app/core/types/tag';
import { Media } from 'src/app/core/types/media';
import { MediaService } from 'src/app/core/services/media.service';

@Component({
	selector: 'isvr-media-filters',
	templateUrl: './media-filters.component.html',
	styleUrls: ['./media-filters.component.scss']
})
export class MediaFiltersComponent implements OnInit {
	public filters: MediaFilter;
	public mediaTypes: MediaType[] = Object.keys(MediaType).map(type => MediaType[type]);
	public mediaLocations: MediaLocation[] = Object.keys(MediaLocation).map(location => MediaLocation[location]);
	public mediaSortBy = MediaSortBy;

	public searchControl: FormControl = new FormControl();
	public context: Context;
	public mediaCount: number = 0;

	constructor(private contextService: ContextService,
				private mediaService: MediaService,
				private _ngZone: NgZone) { }

	ngOnInit() {
		this.setupSearchInput();
		this.contextService.contextChanged.subscribe(this.contextChanged);
	}

	private setupSearchInput(): void {
		this.searchControl.valueChanges.pipe(
			debounceTime(500)
		).subscribe(this.filterBySearch);
	}

	private contextChanged = (newContext: Context): void => {
		this.context = newContext;
		if (this.context) {
			this.handleContext(this.context);
			this.getMediaCount(this.context);
		}
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

			this.filters = <MediaFilter>context.dataObject;
		}
	}

	private getMediaCount(context: Context): void {
		this.mediaService.getMediaByContext(context).subscribe(this.mediaLoaded);
	}

	private mediaLoaded = (media: Media[]): void => {
		this._ngZone.run(() => {
			this.mediaCount = media.length;
		});

	}

	private filterBySearch = (newTerm: string): void => {
		this.filters.term = newTerm;
		this.filtersChanged();
	}

	public filterByTags(tags: Tag[]): void {
		this.filters.tags = tags;
		this.filtersChanged();
	}

	public filtersChanged(): void {
		this.contextService.setContextSearch(this.filters);
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

	public resetFilters(): void {
		this.contextService.resetContext();
	}
}
