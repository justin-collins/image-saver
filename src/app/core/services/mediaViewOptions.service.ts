import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MediaDisplayType } from '../types/mediaDisplayType';
import { MediaViewOption } from '../types/mediaViewOption';
import { SettingsService } from './settings.service';

@Injectable({
	providedIn: 'root'
})
export class MediaViewOptionsService {
	public mediaViewOptionsChanged: BehaviorSubject<MediaViewOption> = new BehaviorSubject(this.mediaViewOptions);

	private _mediaViewOptions: MediaViewOption;
	public get mediaViewOptions(): MediaViewOption { return this._mediaViewOptions; }
	public set mediaViewOptions(newMediaViewOptions: MediaViewOption) {
		this._mediaViewOptions = newMediaViewOptions;
		this.mediaViewOptionsChanged.next(this._mediaViewOptions);
	}

	constructor(private settingsService: SettingsService) {
		this.createInitialViewOptions();
	}

	private createInitialViewOptions(): void {
		let newMediaViewOption: MediaViewOption = {
			thumbSize: this.settingsService.settings.thumb_size,
			displayType: this.settingsService.settings.media_display_type
		};

		this.mediaViewOptions = newMediaViewOption;
	}

	public resetInitialViewOptions(): void {
		this.createInitialViewOptions();
	}
}
