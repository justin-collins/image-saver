import { DatabaseService } from './core/database.service';
import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
	selector: 'isvr-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	public loading: boolean = true;

	constructor(private changeDetection: ChangeDetectorRef) {
		DatabaseService.initialize().subscribe(() => {
			this.loading = false;
			changeDetection.detectChanges();
		});
	}
}
