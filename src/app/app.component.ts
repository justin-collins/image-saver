import { DatabaseService } from './core/database.service';
import { Component, NgZone } from '@angular/core';

@Component({
	selector: 'isvr-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public loading: boolean = true;

	constructor(private _ngZone: NgZone) {
		DatabaseService.initialize().subscribe(() => {
			this._ngZone.run(() => {
				this.loading = false;
			});
		});
	}
}
