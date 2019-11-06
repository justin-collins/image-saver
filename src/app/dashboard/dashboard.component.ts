import { Component, OnInit, NgZone } from '@angular/core';
import { Media } from '../core/media';

@Component({
	selector: 'isvr-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	public media: Media[];

	constructor(private _ngZone: NgZone) { }

	ngOnInit() {
		Media.getAll().subscribe(this.mediaLoaded);
	}

	private mediaLoaded = (mediaResponse: Media[]): void => {
		this._ngZone.run(() => {
			this.media = mediaResponse;
		});
	}
}
