import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Album } from 'src/app/core/album';
import { AlbumService } from 'src/app/core/album.service';
import { MessagingService } from 'src/app/core/messaging.service';

@Component({
	selector: 'isvr-edit-album-dialog',
	templateUrl: './edit-album-dialog.component.html',
	styleUrls: ['./edit-album-dialog.component.scss']
})
export class EditAlbumDialogComponent implements OnInit {
	public album: Album;

	constructor(@Inject(MAT_DIALOG_DATA) private data,
				public dialogRef: MatDialogRef<EditAlbumDialogComponent>,
				private albumService: AlbumService,
				private messagingService: MessagingService,
				private _ngZone: NgZone) { }

	ngOnInit() {
		this.album = this.data['album'];
	}

	public saveAlbum(): void {
		this.albumService.update(this.album).subscribe(() => {
			this._ngZone.run(() => {
				this.messagingService.message('Media Saved!');
				this.dialogRef.close(this.album);
			});
		});
	}
}
