import { Component, NgZone } from '@angular/core';
import { StartupService } from './core/services';

@Component({
	selector: 'isvr-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public unlocked: boolean = false;

	constructor(private startupService: StartupService,
				private _ngZone: NgZone) {

		this.startupService.unlockedChanged.subscribe(this.unlockChanged);
	}

	private unlockChanged = (unlockVal: boolean): void => {
		this._ngZone.run(() => {
			this.unlocked = unlockVal;
		});
	}
}
