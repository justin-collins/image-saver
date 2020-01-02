import { Component, OnInit, NgZone } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Media } from 'src/app/core/media';
import { MessagingService } from 'src/app/core/messaging.service';
import { MediaService } from 'src/app/core/media.service';
import { Tag } from 'src/app/core/tag';
import { TagService } from 'src/app/core/tag.service';

@Component({
	selector: 'isvr-new-media-dialog',
	templateUrl: './new-media-dialog.component.html',
	styleUrls: ['./new-media-dialog.component.scss']
})
export class NewMediaDialogComponent implements OnInit {
	public newMedia: Media;
	public tags: Tag[];

	constructor(public dialogRef: MatDialogRef<NewMediaDialogComponent>,
				private mediaService: MediaService,
				private tagService: TagService,
				private messagingService: MessagingService,
				private _ngZone: NgZone) {
		this.newMedia = new Media();
	}

	ngOnInit() {
	}

	public saveNewMedia(): void {
		this.mediaService.insert(this.newMedia).subscribe(this.mediaSaved);
	}

	private mediaSaved = (mediaResponse: Media): void => {
		this.newMedia = mediaResponse;

		if (this.tags && this.tags.length > 0) {
			this.saveTags();
		} else {
			this.savingFinished();
		}
	}

	public getLocalFileSource(event): void {
		this.newMedia.source = 'file://' + event.target.files[0].path;
	}

	public tagsChanged(newTags: Tag[]): void {
		this.tags = newTags;
	}

	private saveTags(): void {
		this.tagService.addBulkToMedia(this.newMedia, this.tags).subscribe(this.savingFinished);
	}

	private savingFinished = (): void => {
		this._ngZone.run(() => {
			this.messagingService.message('Media Saved!');
			this.dialogRef.close(this.newMedia);
		});
}
}
