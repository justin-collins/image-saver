import { Injectable } from '@angular/core';
import { Observable, merge } from 'rxjs';
import { DatabaseService } from './database.service';
import { SettingsService } from './settings.service';
import { flatMap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class StartupService {
	constructor(private settingsService: SettingsService) { }

	public initialize(): Observable<any> {
		return this.startupDatabase().pipe(
			flatMap(_ => this.startupSettings())
		);
	}

	private startupDatabase(): Observable<any> {
		return DatabaseService.initialize();
	}

	private startupSettings(): Observable<any> {
		return this.settingsService.initialize();
	}
}
