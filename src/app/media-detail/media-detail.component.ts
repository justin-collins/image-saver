import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Media, MediaType } from '../core/types';
import { MediaService, SettingsService } from '../core/services';

@Component({
	selector: 'isvr-media-detail',
	templateUrl: './media-detail.component.html',
	styleUrls: ['./media-detail.component.scss']
})
export class MediaDetailComponent implements OnInit {
	public media: Media;

	public mediaType = MediaType;
	public screenHeight: number;
	public screenWidth: number;
	public screenNavPadding: number = 105;

	public drawerIsOpen: boolean = false;

	constructor(private mediaService: MediaService,
				private settingsService: SettingsService,
				private activatedRoute: ActivatedRoute,
				private _ngZone: NgZone) {
		this.activatedRoute.params.subscribe(this.initialize);
	}

	ngOnInit() {
		this.onResize(window);
		
		this.drawerIsOpen = (this.settingsService.settings.starting_media_drawer_position === 'open');
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
		this._ngZone.run(() => {
			this.media = newMedia;
		});
	}

	private toggleDrawer(): void {
		this.drawerIsOpen = !this.drawerIsOpen;
	}

	public updateDrawerState(isOpen: boolean): void {
		this.drawerIsOpen = isOpen;
	}

	public rotateMedia(rotationDeg: number): void {
		this.mediaService.rotate(this.media, rotationDeg).subscribe(this.mediaLoaded);
	}

	public calcStyles(): Object {
		let styles: Object = {};

		styles['max-width'] = this.calcMediaWidth() + 'px';
		styles['max-height'] = this.calcMediaHeight() + 'px';

		return styles;
	}

	public calcMediaWidth(): number {
		let outputWidth: number;

		if (this.media.rotation === 0 || this.media.rotation === 180) {
			outputWidth = this.screenWidth;
		} else {
			outputWidth = this.screenHeight - this.screenNavPadding;
		}

		return outputWidth;
	}

	public calcMediaHeight(): number {
		let outputHeight: number;
		let trashedBannerHeight: number = 44;
		let videoControlsHeight: number = 5;

		if (this.media.rotation === 0 || this.media.rotation === 180) {
			outputHeight = this.screenHeight - this.screenNavPadding;
		} else {
			outputHeight = this.screenWidth;
		}

		if (this.media.trashed) outputHeight -= trashedBannerHeight;
		if (this.media.type == MediaType.VIDEO) outputHeight -= videoControlsHeight;

		return outputHeight;
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

	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
		this.screenHeight = window.innerHeight;
	}
}
