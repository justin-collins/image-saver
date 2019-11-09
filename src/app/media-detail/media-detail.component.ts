import { Component, OnInit, NgZone } from '@angular/core';
import { Media } from '../core/media';
import { ActivatedRoute } from '@angular/router';
import { MediaType } from '../core/mediaType';
import { MediaService } from '../core/media.service';

@Component({
	selector: 'isvr-media-detail',
	templateUrl: './media-detail.component.html',
	styleUrls: ['./media-detail.component.scss']
})
export class MediaDetailComponent implements OnInit {
	public media: Media;

	public mediaType = MediaType;

	constructor(private mediaService: MediaService,
		private activatedRoute: ActivatedRoute,
		private _ngZone: NgZone) {
		this.activatedRoute.params.subscribe(this.initialize);
	}

	ngOnInit() {
	}

	private initialize = (params): void => {
		let mediaId: number = params['mediaId'];

		if (!mediaId) console.error('Invalid mediaId in URL');

		this.loadMedia(mediaId);
	}

	private loadMedia(mediaId: number): void {
		this.mediaService.get(mediaId).subscribe(this.mediaLoaded);
	}

	private mediaLoaded = (mediaResponse): void => {
		this._ngZone.run(() => {
			this.media = mediaResponse;
		});
	}

}
