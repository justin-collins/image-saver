import { Injectable } from '@angular/core';
import { Settings } from '../types/settings';
import { DatabaseService } from './database.service';
import { Observable, empty, merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {
	private _settings: Settings;
	public get settings(): Settings { return this._settings; }

	constructor() {}

	public initialize(): Observable<any> {
		return this.loadSettings();
	}

	private loadSettings(): Observable<any> {
		const sql = `SELECT * from settings`;
		const values = {};

		return DatabaseService.selectAll(sql, values).pipe(
			map((rows) => {
				this._settings = new Settings().fromTable(rows);
			})
		);
	}

	public update(settingName: string, newValue: string): Observable<Settings> {
		this._settings[settingName] = newValue;

		const sql = `UPDATE settings SET saved_value = $newValue WHERE setting == $settingName`;
		const values = {$settingName: settingName, $newValue: newValue};

		return DatabaseService.update(sql, values).pipe(
			map(_ => this.settings)
		);
	}

	public updateAll(newSettings: Settings): Observable<Settings> {
		this._settings = newSettings;

		let settingsRequests: Observable<Settings>[] = [];

		for (let key in newSettings) {
			settingsRequests.push(this.update(key, newSettings[key]));
		}

		return merge(...settingsRequests);
	}
}
