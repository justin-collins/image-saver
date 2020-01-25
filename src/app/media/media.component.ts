import { Component, OnInit, NgZone } from '@angular/core';
import { Media } from '../core/media';
import { MediaService } from '../core/media.service';
import { MediaFilter } from '../core/media.service';
import { ContextService } from '../core/context.service';
import { Context } from '../core/context';
import { ContextType } from '../core/contextType';

@Component({
	selector: 'isvr-media',
	templateUrl: './media.component.html',
	styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
	public media: Media[];
	public numCols: number = 5;
	public warning: string = '';
	public filters: MediaFilter;

	constructor(private mediaService: MediaService,
				private contextService: ContextService,
				private _ngZone: NgZone) {
		this.resetFilters();
	}

	ngOnInit() {
		this.loadMedia(this.filters);
		this.contextService.contextChanged.subscribe(this.contextChanged);
	}

	private loadMedia(newFilter: MediaFilter): void {
		this.mediaService.getFiltered(newFilter).subscribe(this.mediaLoaded);
	}

	private mediaLoaded = (mediaResponse: Media[]): void => {
		this._ngZone.run(() => {
			this.media = mediaResponse;
			this.warning = this.checkWarning();
		});
	}

	private contextChanged = (context: Context): void => {
		if (context && context.type === ContextType.SEARCH) {
			this.filters = <MediaFilter>context.dataObject;
			this.loadMedia(this.filters);
		} else if (!context) {
			this.resetFilters();
		}
	}

	public newMediaAdded(newMedia: Media): void {
		this.media.unshift(newMedia);
		this.resetFilters();
	}

	public mediaRemoved(removeMedia: Media): void {
		let index: number = this.media.findIndex(med => med.id === removeMedia.id);

		if (index > -1) {
			this.media.splice(index, 1);
		}
	}

	private checkWarning(): string {
		if (!this.media) return '';
		if (this.media.length === 0 && this.filtersAreEmpty()) {
			return 'Use the button below to add new media';
		} else if (this.media.length === 0 && !this.filtersAreEmpty()) {
			return 'No Media found matching supplied filters';
		}
	}

	private resetFilters(): void {
		this.filters = {
			term: '',
			type: null,
			location: null
		};
		this.loadMedia(this.filters);
	}

	private filtersAreEmpty(): boolean {
		if (this.filters.term || this.filters.type || this.filters.location) return false;
		return true;
	}
}