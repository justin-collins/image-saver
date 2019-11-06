import { Component, OnInit, Input } from '@angular/core';
import { Media } from 'src/app/core/media';

@Component({
	selector: 'isvr-preview-large',
	templateUrl: './preview-large.component.html',
	styleUrls: ['./preview-large.component.scss']
})
export class PreviewLargeComponent implements OnInit {
	@Input() media: Media;

	constructor() { }

	ngOnInit() {
		if (!this.media) {
			console.error('A media must be provided for the preview component');
		}
	}

}
