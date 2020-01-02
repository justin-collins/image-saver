import { Component, OnInit, NgZone } from '@angular/core';
import { Media } from '../core/media';
import { MediaService } from '../core/media.service';

@Component({
	selector: 'isvr-media',
	templateUrl: './media.component.html',
	styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
	public media: Media[];

	public numCols: number = 5;

	constructor(private mediaService: MediaService,
				private _ngZone: NgZone) { }

	ngOnInit() {
		this.loadAllMedia();
	}

	private loadAllMedia(): void {
		this.mediaService.getAll().subscribe(this.mediaLoaded);
	}

	private mediaLoaded = (mediaResponse: Media[]): void => {
		this._ngZone.run(() => {
			this.media = mediaResponse;
		});
	}

	public newMediaAdded(newMedia: Media): void {
		this.media.unshift(newMedia);
	}

	public mediaRemoved(removeMedia: Media): void {
		let index: number = this.media.findIndex(med => med.id === removeMedia.id);

		if (index > -1) {
			this.media.splice(index, 1);
		}
	}
}
