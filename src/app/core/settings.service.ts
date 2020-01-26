import { Injectable } from '@angular/core';

const storage = require('electron-json-storage');

export interface KeyboardShortcuts {
	NAVIGATE_LEFT_1: string;
	NAVIGATE_LEFT_2: string;
	NAVIGATE_RIGHT_1: string;
	NAVIGATE_RIGHT_2: string;
	START_STOP_SLIDESHOW_1: string;
	START_STOP_SLIDESHOW_2: string;
	OPEN_MEDIA_DRAWER_1: string;
	OPEN_MEDIA_DRAWER_2: string;
}

@Injectable({
	providedIn: 'root'
})
export class SettingsService {

	constructor() {
		// storage.set('keyboardShortcuts', newShortcuts);
		// storage.get('test', (error, data: KeyboardShortcuts) => {
		// 	return data;
		// });
	}
}
