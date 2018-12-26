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
		Media.getAll().subscribe((results) => {
			this._ngZone.run(() => {
				this.media = results;
			}
		});
	}
}
