import { Component, OnInit, NgZone } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Media } from 'src/app/core/media';
import { MessagingService } from 'src/app/core/messaging.service';
import { MediaService } from 'src/app/core/media.service';

@Component({
	selector: 'isvr-new-media-dialog',
	templateUrl: './new-media-dialog.component.html',
	styleUrls: ['./new-media-dialog.component.scss']
})
export class NewMediaDialogComponent implements OnInit {
	public newMedia: Media;
	public urlreg = /^(?:(?:(?:https?|ftp|file):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

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
}
