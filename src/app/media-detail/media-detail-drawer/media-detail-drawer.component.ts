import { Component, OnInit, Input } from '@angular/core';
import { Media } from 'src/app/core/media';

var shell = require('electron').shell;

@Component({
	selector: 'isvr-media-detail-drawer',
	templateUrl: './media-detail-drawer.component.html',
	styleUrls: ['./media-detail-drawer.component.scss']
})
export class MediaDetailDrawerComponent implements OnInit {
	@Input() media: Media;

	constructor() { }

	ngOnInit() {
		if (!this.media) {
			console.error('A media must be provided for the media detail drawer component');
		}
	}

	public openSource(): void {
		shell.openExternal(this.media.url);
	}
}
