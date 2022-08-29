import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Media } from 'src/app/core/types/media';
import { MediaService } from 'src/app/core/services/media.service';

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
		shell.openExternal(this.media.source);
	}

	public trashMedia(): void {
		this.mediaService.trash(this.media).subscribe(this.mediaTrashed);
	}

	private mediaTrashed = (): void => {
		this.media.trashed = true;
		this.onMediaChange.emit(this.media);
	}
}
