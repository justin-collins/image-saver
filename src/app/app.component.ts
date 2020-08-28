import { Component, NgZone } from '@angular/core';
import { StartupService } from './core/startup.service';

@Component({
	selector: 'isvr-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public loading: boolean = true;

	constructor(private startupService: StartupService,
				private _ngZone: NgZone) {
		this.startupService.initialize().subscribe(() => {
			this._ngZone.run(() => {
				this.loading = false;
			});
		});
	}
}
