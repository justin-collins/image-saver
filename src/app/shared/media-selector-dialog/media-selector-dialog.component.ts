import { Component, OnInit, Inject, NgZone, HostListener } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MediaSelectorSettings } from '../media-selector.directive';
import { ContextType, Media } from '../../core/types';
import { MediaService } from '../../core/services';

@Component({
	selector: 'isvr-media-selector-dialog',
	templateUrl: './media-selector-dialog.component.html',
	styleUrls: ['./media-selector-dialog.component.scss']
})
export class MediaSelectorDialogComponent implements OnInit {
	public media: Media[];
	public mediaSelected: Media[];
	public numCols: number = 4;

	public settings: MediaSelectorSettings;

	constructor(@Inject(MAT_DIALOG_DATA) private data,
			private mediaService: MediaService,
			public dialogRef: MatDialogRef<MediaSelectorDialogComponent>,
			private _ngZone: NgZone) {
	}

	ngOnInit() {
		this.settings = this.initializeSettings(this.data['settings']);
		this.mediaSelected = [];

		this.loadMedia();
	}

	private initializeSettings(startingSettings: MediaSelectorSettings): MediaSelectorSettings {
		let finalSettings: MediaSelectorSettings = startingSettings;

		finalSettings.exclude = finalSettings.exclude || false;
		finalSettings.maxSelections = finalSettings.maxSelections || 50;

		return finalSettings;
	}

	private loadMedia(): void {
		if (this.settings.dataType = ContextType.ALBUM) {
			this.loadMediaByAlbum();
		} else if (this.settings.dataType = ContextType.TAG) {
			this.loadMediaByTag();
		} else {
			this.mediaService.getAll().subscribe(this.mediaLoaded);
		}
	}

	private loadMediaByAlbum(): void {
		this.mediaService.getByAlbumId(this.settings.dataId, this.settings.exclude).subscribe(this.mediaLoaded);
	}

	private loadMediaByTag(): void {

	}

	private mediaLoaded = (mediaResponse: Media[]): void => {
		this.media = mediaResponse;
	}

	public toggleMediaSelection(selectedMedia: Media): void {
		if (!this.mediaSelectedContains(selectedMedia)) {
			this.selectMedia(selectedMedia);
		} else {
			this.unSelectMedia(selectedMedia);
		}
	}

	private selectMedia(selectedMedia: Media): void {
		if (this.mediaSelected.length === this.settings.maxSelections) return;

		this.mediaSelected.push(selectedMedia);
	}

	private unSelectMedia(removeMedia: Media): void {
		if (this.mediaSelectedContains(removeMedia)) {
			let index: number = this.mediaSelected.findIndex(med => med.id === removeMedia.id);
			this.mediaSelected.splice(index, 1);
		}
	}

	public mediaSelectedContains(theMedia: Media): boolean {
		let index: number = this.mediaSelected.findIndex(med => med.id === theMedia.id);
		return (index === -1)? false : true;
	}

	public mediaSelectionComplete(): void {
		this._ngZone.run(() => {
			this.dialogRef.close(this.mediaSelected);
		});
	}

	public calcMediaHeight(): number {
		let newSize: number = window.innerWidth *.18;

		return newSize;
	}

	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.calcMediaHeight();
	}
}
