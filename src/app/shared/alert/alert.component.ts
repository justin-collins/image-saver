import { ISVRAnimations } from './../animations';
import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'isvr-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss'],
	animations: [ISVRAnimations.ngIfSlide]
})
export class AlertComponent implements OnInit {

	@Input() message: string;
	@Input() type: string = AlertTypes.INFO;

	constructor() {
		this.type = this.type || AlertTypes.INFO;
	}

	ngOnInit() {
	}

}

export class AlertTypes {
	static INFO: string = 'INFO';
	static WARNING: string = 'WARNING';
	static SUCCESS: string = 'SUCCESS';
	static DANGER: string = 'DANGER';
}
