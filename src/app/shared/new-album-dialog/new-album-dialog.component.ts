import { Component, OnInit, NgZone } from '@angular/core';
import { Album } from 'src/app/core/album';
import { AlbumService } from 'src/app/core/album.service';
import { MessagingService } from 'src/app/core/messaging.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'isvr-new-album-dialog',
	templateUrl: './new-album-dialog.component.html',
	styleUrls: ['./new-album-dialog.component.scss']
})
export class NewAlbumDialogComponent implements OnInit {
	public newAlbum: Album;

	constructor(public dialogRef: MatDialogRef<NewAlbumDialogComponent>,
				private albumService: AlbumService,
				private messagingService: MessagingService,
				private _ngZone: NgZone) {
		this.newAlbum = new Album();
	}

	ngOnInit() {
	}

	public saveNewAlbum(): void {
		this.albumService.insert(this.newAlbum).subscribe(() => {
			this._ngZone.run(() => {
				this.messagingService.message('Media Saved!');
				this.dialogRef.close(this.newAlbum);
			});
		});
	}

}
