import { Component, OnInit, NgZone, HostListener } from '@angular/core';
import { Media } from '../core/media';
import { ActivatedRoute } from '@angular/router';
import { MediaType } from '../core/mediaType';
import { MediaService } from '../core/media.service';
import { ISVRAnimations } from '../shared/animations';
import { SettingsService } from '../core/settings.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
	public screenHeight: number;
	public screenWidth: number;
	public screenNavPadding: number = 105;

	constructor(private mediaService: MediaService,
				private settingsService: SettingsService,
				private activatedRoute: ActivatedRoute,
				private sanitizer: DomSanitizer,
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
		this.media = newMedia;
	}

	public toggleDrawer(): void {
		this.drawerIsOpen = !this.drawerIsOpen;
	}

	public rotateMedia(rotationDeg: number): void {
		this.mediaService.rotate(this.media, rotationDeg).subscribe(this.mediaLoaded);
	}

	public calcStyles(): Object {
		let styles: Object = {};

		if (this.media.type === MediaType.IMAGE || this.media.type === MediaType.GIF) styles['background-image'] = 'url(' + this.fixedEscape(this.media.url) + ')';
		if (this.media.rotation > 0) {
			styles['transform'] = 'rotate(' + this.media.rotation + 'deg)';

			switch(this.media.rotation) {
				case 90:
					styles['transform'] += ' translate(50%, -50%)';
					break;
				case 180:
					styles['transform'] += ' translate(0%, -100%)';
					break;
				case 270:
					styles['transform'] += ' translate(-50%, -50%)';
					break;
			}

			styles['max-width'] = this.calcMediaWidth() + 'px';
			styles['max-height'] = this.calcMediaHeight() + 'px';
		}

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

		if (this.media.rotation === 0 || this.media.rotation === 180) {
			outputHeight = this.screenHeight - this.screenNavPadding;
		} else {
			outputHeight = this.screenWidth;
		}

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

	public fixedEscape(url: string): string {
		let escapedUrl: string = escape(url);
		escapedUrl = escapedUrl.replace('media%3A', 'media:');

		return escapedUrl;
	}

	public sanitizeVideoUrl(url: string): SafeResourceUrl {
		let escapedUrl: string = this.fixedEscape(url);

		return this.sanitizer.bypassSecurityTrustResourceUrl(escapedUrl);
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
