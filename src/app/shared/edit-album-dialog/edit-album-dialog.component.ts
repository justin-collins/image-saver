import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MediaSelectorSettings } from '../media-selector.directive';
import { Album, ContextType, Media } from 'src/app/core/types';
import { AlbumService, MessagingService } from 'src/app/core/services';

@Component({
	selector: 'isvr-edit-album-dialog',
	templateUrl: './edit-album-dialog.component.html',
	styleUrls: ['./edit-album-dialog.component.scss']
})
export class EditAlbumDialogComponent implements OnInit {
	public album: Album;

	public mediaSelectorSettings: MediaSelectorSettings;

	constructor(@Inject(MAT_DIALOG_DATA) private data,
				public dialogRef: MatDialogRef<EditAlbumDialogComponent>,
				private albumService: AlbumService,
				private messagingService: MessagingService,
				private router: Router,
				private _ngZone: NgZone) { }

	ngOnInit() {
		this.album = this.data['album'];
		this.setupMediaSelectorSettings();
	}

	private setupMediaSelectorSettings(): void {
		this.mediaSelectorSettings = {
			dataId: this.album.id,
			dataType: ContextType.ALBUM,
			maxSelections: 1
		}
	}

	public saveAlbum(): void {
		this.albumService.update(this.album).subscribe(() => {
			this._ngZone.run(() => {
				this.messagingService.message('Album Saved!');
				this.dialogRef.close(this.album);
			});
		});
	}

	public newCoverSelected = (newCover: Media[]): void => {
		this._ngZone.run(() => {
			this.album.cover = newCover[0];
		});
	}

	public deleteAlbum(): void {
		this.albumService.delete(this.album).subscribe(this.albumDeleted);
	}

	private albumDeleted = (): void => {
		this._ngZone.run(() => {
			this.messagingService.message('Album Deleted!');
			this.dialogRef.close(null);
			this.router.navigate(['/albums']);
		});
	}
}
