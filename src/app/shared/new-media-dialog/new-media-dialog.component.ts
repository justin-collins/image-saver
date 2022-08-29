import { Component, OnInit, NgZone } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Media } from 'src/app/core/types/media';
import { MessagingService } from 'src/app/core/services/messaging.service';
import { MediaService } from 'src/app/core/services/media.service';
import { Tag } from 'src/app/core/types/tag';

@Component({
	selector: 'isvr-new-media-dialog',
	templateUrl: './new-media-dialog.component.html',
	styleUrls: ['./new-media-dialog.component.scss']
})
export class NewMediaDialogComponent implements OnInit {
	public newMedia: Media[] = [];
	public tags: Tag[];
	public interfaceDisabled: boolean = false;

	public newMediaUrl: string;
	public newMediaTitle: string;

	constructor(public dialogRef: MatDialogRef<NewMediaDialogComponent>,
				private mediaService: MediaService,
				private messagingService: MessagingService,
				private _ngZone: NgZone) {
	}

	ngOnInit() {
	}

	public saveNewMedia(): void {
		this.interfaceDisabled = true;
		this.checkURl();
		this.checkTitles();
		this.mediaService.insertWithTags(this.newMedia, this.tags).subscribe(this.mediaSaved);
	}

	private mediaSaved = (mediaResponse: Media[]): void => {
		this.newMedia = mediaResponse;
		this.savingFinished();
	}

	public getLocalFileSource(event): void {
		for (let i = 0; i < event.target.files.length; i++) {
			const file = event.target.files[i];

			let media: Media = new Media();
			media.source = 'media://' + file.path;
			media.title = this.newMediaTitle;

			this.newMedia.push(media);
		}

		this.newMediaUrl = `${event.target.files.length} Local File`;
		if (event.target.files.length !== 1) this.newMediaUrl += 's';
	}

	public checkURl(): void {
		if (this.newMedia.length === 0 && this.newMediaUrl) {
			let media: Media = new Media();
			media.source = this.newMediaUrl;
			this.newMedia.push(media);
		}
	}

	public checkTitles(): void {
		for (let i = 0; i < this.newMedia.length; i++) {
			const media = this.newMedia[i];
			media.title = this.newMediaTitle;
		}
	}

	public tagsChanged(newTags: Tag[]): void {
		this.tags = newTags;
	}

	private savingFinished = (): void => {
		this._ngZone.run(() => {
			this.interfaceDisabled = false;
			this.messagingService.message('Media Saved!');
			this.dialogRef.close(this.newMedia);
		});
}
}
