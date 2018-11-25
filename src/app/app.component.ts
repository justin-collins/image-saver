import { DatabaseService } from './core/database.service';
import { Component } from '@angular/core';

@Component({
	selector: 'isvr-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	constructor( ) {
		DatabaseService.initialize();
	}
}
