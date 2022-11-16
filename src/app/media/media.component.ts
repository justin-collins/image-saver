import { Component, OnInit, NgZone, HostListener, ViewChild } from '@angular/core';
import { Media } from '../core/types/media';
import { MediaService } from '../core/services/media.service';
import { ContextService } from '../core/services/context.service';
import { Context } from '../core/types/context';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { QuickStartDialogComponent } from './quick-start-dialog/quick-start-dialog.component';
import { SettingsService } from '../core/services/settings.service';
import { MediaFilter } from '../core/types/mediaFilter';
import { MediaViewOptionsService } from '../core/services/mediaViewOptions.service';
import { MediaViewOption } from '../core/types/mediaViewOption';
import { VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { MediaDisplayType } from '../core/types/mediaDisplayType';
import { MatTable } from '@angular/material/table';

@Component({
	selector: 'isvr-media',
	templateUrl: './media.component.html',
	styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
	public displayedColumns: string[] = ['preview', 'title', 'type', 'createdAt', 'actions'];
	public media: Media[];
	public warning: string = '';
	public filters: MediaFilter;
	public viewOptions: MediaViewOption;
	public mediaDisplayType = MediaDisplayType;
	public filtersIsOpen: boolean = false;

	@ViewChild(VirtualScrollerComponent)
    private virtualScroller: VirtualScrollerComponent;

	@ViewChild(MatTable)
	private table: MatTable<Media[]>;

	private quickStartDialogRef: MatDialogRef<QuickStartDialogComponent>;
	private quickStartDialogConfig: MatDialogConfig = {
		width: '80%',
		maxHeight: '400px'
	};

	constructor(private mediaService: MediaService,
				private contextService: ContextService,
				private settingsService: SettingsService,
				private mediaViewOptionsService: MediaViewOptionsService,
				private dialog: MatDialog,
				private _ngZone: NgZone) {
	}

	ngOnInit() {
		this.contextService.contextChanged.subscribe(this.contextChanged);
		this.mediaViewOptionsService.mediaViewOptionsChanged.subscribe(this.viewOptionsChanged);
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

	private viewOptionsChanged = (viewOptions: MediaViewOption): void => {
		if (viewOptions) {
			this.viewOptions = viewOptions;
		}

		if (this.virtualScroller) {
			this.virtualScroller.refresh();
		}
	}

	public newMediaAdded(newMedia: Media): void {
		this.media.unshift(newMedia);
	}

	public trashMedia(removeMedia: Media): void {
		this.mediaService.trash(removeMedia).subscribe(this.mediaRemoved);
	}

	public mediaRemoved = (removeMedia: Media): void => {
		let index: number = this.media.findIndex(med => med.id === removeMedia.id);

		if (index > -1) {
			this._ngZone.run(() => {
				this.media.splice(index, 1);

				if (this.table) {
					this.table.renderRows();
				}
			});
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

	public calcMediaSize(): Object {
		let scrollbarWidth = 30;
		let drawerToggleBtnWidth = 36;
		let drawerWidth = this.filtersIsOpen ? 301 : 0;
		let minMarginSize: number = 0.01;
		let newMediaSize: number = this.viewOptions.thumbSize - (minMarginSize * 2);
		let marginSize: number = this.calcMediaMargin(newMediaSize);
		let finalSize: number = (window.innerWidth - scrollbarWidth - drawerToggleBtnWidth - drawerWidth) * newMediaSize;

		return {
			width: finalSize + 'px',
			height: finalSize + 'px',
			marginLeft: (marginSize * 100) + '%',
			marginRight: (marginSize * 100) + '%'
		};
	}

	private calcMediaMargin(newMediaSize: number): number {
		let numberOfThumbs: number = Math.floor(1/newMediaSize);
		let leftoverSize: number = 1 - (numberOfThumbs * newMediaSize);
		let outputSize = (leftoverSize / numberOfThumbs) / 2;

		return outputSize;
	}

	private filtersAreEmpty(): boolean {
		if (this.filters.term || this.filters.type || this.filters.location) return false;
		return true;
	}

	public preventDefault(event): void {
		event.preventDefault();
		event.stopPropagation();
	}

	public updateDrawerState(isOpen: boolean): void {
		this.filtersIsOpen = isOpen;
	}

	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.calcMediaSize();
		this.virtualScroller.refresh();
	}
}
