import { Component, OnInit, NgZone } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Media } from 'src/app/core/media';
import { MessagingService } from 'src/app/core/messaging.service';
import { MediaService } from 'src/app/core/media.service';

var dialog = require('electron');

@Component({
	selector: 'isvr-new-media-dialog',
	templateUrl: './new-media-dialog.component.html',
	styleUrls: ['./new-media-dialog.component.scss']
})
export class NewMediaDialogComponent implements OnInit {
	public newMedia: Media;

	constructor(private mediaService: MediaService,
				public dialogRef: MatDialogRef<NewMediaDialogComponent>,
				private messagingService: MessagingService,
				private _ngZone: NgZone) {
		this.newMedia = new Media();
	}

	ngOnInit() {
	}

	public saveNewMedia(): void {
		this.mediaService.insert(this.newMedia).subscribe(() => {
			this._ngZone.run(() => {
				this.messagingService.message('Media Saved!');
				this.dialogRef.close(this.newMedia);
			});
		});
	}

	public getLocalFileUrl(event): void {
		console.log(event);
		this.newMedia.url = 'file://' + event.target.files[0].path;
	}
}
