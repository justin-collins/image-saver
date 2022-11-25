import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Media, MediaLocation } from 'src/app/core/types';
import { MediaService } from 'src/app/core/services';

var shell = require('electron').shell;

@Component({
	selector: 'isvr-media-detail-drawer',
	templateUrl: './media-detail-drawer.component.html',
	styleUrls: ['./media-detail-drawer.component.scss']
})
export class MediaDetailDrawerComponent implements OnInit {
	@Input() media: Media;
	@Output() onMediaChange = new EventEmitter<Media>();

	constructor(private mediaService: MediaService) { }

	ngOnInit() {
		if (!this.media) {
			console.error('A media must be provided for the media detail drawer component');
		}
	}

	public openSource(): void {
		let formattedMediaSource: string = this.media.source;
		if (this.media.location === MediaLocation.LOCAL) {
			formattedMediaSource = formattedMediaSource.replace('media://', '');
			shell.showItemInFolder(formattedMediaSource);
		} else {
			shell.openExternal(formattedMediaSource);
		}
	}

	public trashMedia(): void {
		this.mediaService.trash(this.media).subscribe(this.mediaTrashed);
	}

	private mediaTrashed = (): void => {
		this.media.trashed = true;
		this.onMediaChange.emit(this.media);
	}
}
