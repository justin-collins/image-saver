import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditAlbumDialogComponent } from '../edit-album-dialog/edit-album-dialog.component';
import { Media } from 'src/app/core/media';
import { AlbumService } from 'src/app/core/album.service';
import { MediaService } from 'src/app/core/media.service';

@Component({
	selector: 'isvr-media-selector-dialog',
	templateUrl: './media-selector-dialog.component.html',
	styleUrls: ['./media-selector-dialog.component.scss']
})
export class MediaSelectorDialogComponent implements OnInit {
	public media: Media[];
	public mediaSelected: Media[];
	public numCols: number = 4;

	public maxSelections: number;
	private albumId: number;
	private tagId: number;

	constructor(@Inject(MAT_DIALOG_DATA) private data,
			private mediaService: MediaService,
			private albumService: AlbumService,
			public dialogRef: MatDialogRef<EditAlbumDialogComponent>,
			private _ngZone: NgZone) {
	}

	ngOnInit() {
		this.albumId = this.data['albumId'];
		this.tagId = this.data['tagId'];
		this.maxSelections = this.data['maxSelections'] || 50;

		if (this.albumId && this.tagId) {
			console.warn('albumId and tagId cannot be used in conjunction on the media selector. tagId will be ignored.')
		}

		this.mediaSelected = [];

		this.loadMedia();
	}

	private loadMedia(): void {
		if (this.albumId) {
			this.albumService.getAllMediaByAlbumId(this.albumId).subscribe(this.mediaLoaded);
		} else if (this.tagId) {
		} else {
			this.mediaService.getAll().subscribe(this.mediaLoaded);
		}
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
		if (this.mediaSelected.length === this.maxSelections) return;

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
}
