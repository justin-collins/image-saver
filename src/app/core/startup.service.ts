import { Injectable } from '@angular/core';
import { Observable, merge, BehaviorSubject } from 'rxjs';
import { DatabaseService } from './database.service';
import { SettingsService } from './settings.service';
import { flatMap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class StartupService {
	public unlockedChanged: BehaviorSubject<boolean> = new BehaviorSubject(this.unlocked);

	private _unlocked: boolean = false;
	public get unlocked(): boolean { return this._unlocked; }
	public set unlocked(newUnlock: boolean) {
		this._unlocked = newUnlock;
		this.unlockedChanged.next(this._unlocked);
	}

	constructor(private settingsService: SettingsService) { }

	public initialize(): Observable<any> {
		return this.startupSettings().pipe(
			// flatMap(_ => this.startupSettings())
		);
	}

	public startupDatabase(passKey: string): Observable<any> {
		return DatabaseService.initialize(passKey);
	}

	private startupSettings(): Observable<any> {
		return this.settingsService.initialize();
	}
}
