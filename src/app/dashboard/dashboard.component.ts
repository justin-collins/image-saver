import { Component, OnInit, NgZone } from '@angular/core';
import { Media } from '../core/media';
import { MediaService } from '../core/media.service';

@Component({
	selector: 'isvr-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	public media: Media[];

	public numCols: number = 5;

	constructor(private mediaService: MediaService,
				private _ngZone: NgZone) { }

	ngOnInit() {
		this.mediaService.getAll().subscribe(this.mediaLoaded);
	}

	private mediaLoaded = (mediaResponse: Media[]): void => {
		this._ngZone.run(() => {
			this.media = mediaResponse;
		});
	}
}
