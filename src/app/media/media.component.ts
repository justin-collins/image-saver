import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { Media } from '../core/media';
import { MediaService } from '../core/media.service';
import { ContextService } from '../core/context.service';
import { Context } from '../core/context';
import { ContextType } from '../core/contextType';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { QuickStartDialogComponent } from './quick-start-dialog/quick-start-dialog.component';
import { SettingsService } from '../core/settings.service';
import { MediaFilter } from '../core/mediaFilter';

@Component({
	selector: 'isvr-media',
	templateUrl: './media.component.html',
	styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
	public media: Media[];
	public warning: string = '';
	public filters: MediaFilter;

	private quickStartDialogRef: MatDialogRef<QuickStartDialogComponent>;
	private quickStartDialogConfig: MatDialogConfig = {
		width: '80%',
		maxHeight: '400px'
	};

	constructor(private mediaService: MediaService,
				private contextService: ContextService,
				private settingsService: SettingsService,
				private dialog: MatDialog,
				private _ngZone: NgZone) {
	}

	ngOnInit() {
		this.contextService.contextChanged.subscribe(this.contextChanged);
	}

	private loadMedia(newFilter: MediaFilter): void {
		this.mediaService.getFiltered(newFilter).subscribe(this.mediaLoaded);
	}

	private mediaLoaded = (mediaResponse: Media[]): void => {
		this._ngZone.run(() => {
			this.media = mediaResponse;
			this.warning = this.checkWarning();
			this.checkShowQuickStart();
		});
	}

	private checkShowQuickStart(): void {
		if (this.quickStartDialogRef) return;
		if (this.settingsService.settings.show_quickstart.toLowerCase() === 'false') return;

		if (this.media && this.media.length === 0) {
			this.quickStartDialogRef = this.dialog.open(QuickStartDialogComponent, this.quickStartDialogConfig);
			this.quickStartDialogRef.afterClosed().subscribe((result) => {
				this.quickStartDialogRef = null;
				this.quickStartRun();
			});
		}
	}

	private quickStartRun(): void {
		this.settingsService.update('show_quickstart', 'false').subscribe(_ => '');
		this.loadMedia(this.filters);
	}

	private contextChanged = (context: Context): void => {
		if (context) {
			this.filters = <MediaFilter>context.dataObject;
		}
		this.loadMedia(this.filters);
	}

	public newMediaAdded(newMedia: Media): void {
		this.media.unshift(newMedia);
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

	public calcMediaHeight(): number {
		let newSize: number = window.innerWidth *.18;

		return newSize;
	}

	private filtersAreEmpty(): boolean {
		if (this.filters.term || this.filters.type || this.filters.location) return false;
		return true;
	}

	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.calcMediaHeight();
	}
}
