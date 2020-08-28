import { Component, OnInit, NgZone } from '@angular/core';
import { SettingsService } from '../core/settings.service';
import { Settings } from '../core/settings';
import { MessagingService } from '../core/messaging.service';

@Component({
	selector: 'isvr-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
	public settings: Settings;

	constructor(private settingsService: SettingsService,
				private messagingService: MessagingService,
				private _ngZone: NgZone) { }

	ngOnInit() {
		this.resetSettings();
	}

	public resetSettings(): void {
		this._ngZone.run(() => {
			this.settings = new Settings(this.settingsService.settings);
		});
	}

	public saveSettings(): void {
		this.settingsService.updateAll(this.settings).subscribe(this.settingsSaved);
	}

	private settingsSaved = (response: Settings): void => {
		this.messagingService.message('Settings Saved!');
		this.resetSettings();
	}
}
