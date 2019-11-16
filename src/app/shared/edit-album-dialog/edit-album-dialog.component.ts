import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Album } from 'src/app/core/album';
import { AlbumService } from 'src/app/core/album.service';
import { MessagingService } from 'src/app/core/messaging.service';
import { Media } from 'src/app/core/media';
import { Router } from '@angular/router';
import { MediaSelectorSettings } from '../media-selector.directive';
import { ContextType } from 'src/app/core/contextType';

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
