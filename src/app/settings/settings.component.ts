import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../core/settings.service';

@Component({
	selector: 'isvr-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

	constructor(private settingsService: SettingsService) { }

	ngOnInit() {
	}

}
