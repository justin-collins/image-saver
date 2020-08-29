import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { Media } from '../core/media';
import { ActivatedRoute } from '@angular/router';
import { MediaType } from '../core/mediaType';
import { MediaService } from '../core/media.service';
import { ISVRAnimations } from '../shared/animations';
import { SettingsService } from '../core/settings.service';

@Component({
	selector: 'isvr-media-detail',
	templateUrl: './media-detail.component.html',
	styleUrls: ['./media-detail.component.scss'],
	animations: [ISVRAnimations.drawerOpen]
})
export class MediaDetailComponent implements OnInit {
	public media: Media;

	public mediaType = MediaType;
	public drawerIsOpen: boolean = false;

	constructor(private mediaService: MediaService,
				private settingsService: SettingsService,
				private activatedRoute: ActivatedRoute,
				private _ngZone: NgZone) {
		this.activatedRoute.params.subscribe(this.initialize);
	}

	ngOnInit() {
	}

	private initialize = (params): void => {
		let mediaId: number = params['mediaId'];

		if (!mediaId) console.error('Invalid mediaId in URL');

		this.loadMedia(mediaId);
	}

	private loadMedia(mediaId: number): void {
		this.mediaService.get(mediaId).subscribe(this.mediaLoaded);
	}

	private mediaLoaded = (mediaResponse): void => {
		this._ngZone.run(() => {
			this.media = mediaResponse;
		});
	}

	public newMediaSelected(newMedia: Media): void {
		this.media = newMedia;
	}

	public toggleDrawer(): void {
		this.drawerIsOpen = !this.drawerIsOpen;
	}

	public restoreMedia(): void {
		this.mediaService.restore(this.media).subscribe(this.mediaRestored);
	}

	private mediaRestored = (): void => {
		this._ngZone.run(() => {
			this.media.trashed = false;
		});
	}

	@HostListener('window:keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		let keyValue: string = event.key;
		if (keyValue === ' ') keyValue = 'Space';

		switch (keyValue) {
			case this.settingsService.settings.open_media_drawer_1:
			case this.settingsService.settings.open_media_drawer_2:
				this.toggleDrawer();
				break;
		}
	}
}
