import { Component, OnInit } from '@angular/core';
import { Media } from '../core/media';

@Component({
	selector: 'isvr-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	constructor() { }

	ngOnInit() {
		const newMedia: Media = new Media();
		newMedia.url = 'http://www.google.com';
		newMedia.insert().subscribe(() => console.log('inserted'));
	}

}
