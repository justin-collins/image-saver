import { Component, OnInit, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { Media } from 'src/app/core/media';
import { Context } from 'src/app/core/context';
import { ContextService } from 'src/app/core/context.service';
import { MediaService, MediaFilter } from 'src/app/core/media.service';
import { ContextType } from 'src/app/core/contextType';
import { SettingsService } from 'src/app/core/settings.service';

@Component({
	selector: 'isvr-media-detail-navigation',
	templateUrl: './media-detail-navigation.component.html',
	styleUrls: ['./media-detail-navigation.component.scss']
})
export class MediaDetailNavigationComponent implements OnInit {
	@Input() startingMedia: Media;
	@Output() onMediaChange = new EventEmitter<Media>();
	@Output() onMediaRotate = new EventEmitter<number>();

	public context: Context;
	public media: Media[];
	public currentPosition: number = 0;
	public slideshowTimer;

	private slideshowMsPerMedia: number = 100;
	private defaultRotationDeg: number = 90;

	constructor(private mediaService: MediaService,
				private settingsService: SettingsService,
				private contextService: ContextService) { }

	ngOnInit() {
		this.slideshowMsPerMedia = this.settingsService.settings.slideshow_speed_ms;

		this.context = this.contextService.context;
		if (this.context) {
			this.getMediaFromContext();
		} else {
			this.getDefaultMedia();
		}
	}

	private getDefaultMedia(): void {
		this.mediaService.getAll().subscribe(this.mediaLoaded);
	}

	private getMediaFromContext(): void {
		if (this.context.type === ContextType.SEARCH) {
			this.getMediaFromSearch();
		} else if (this.context.type === ContextType.ALBUM) {
			this.getMediaFromAlbum();
		}
	}

	private getMediaFromSearch(): void {
		this.mediaService.getFiltered(<MediaFilter>this.context.dataObject).subscribe(this.mediaLoaded);
	}

	private getMediaFromAlbum(): void {
		this.mediaService.getByAlbumId(this.context.dataObject['id']).subscribe(this.mediaLoaded);
	}

	private mediaLoaded = (response: Media[]): void => {
		this.media = response;
		this.findStartingPosition();
	}

	public nextMedia(): void {
		let newPosition: number = this.checkBounds(this.currentPosition + 1);
		this.newMediaSelected(newPosition);
	}

	public previousMedia(): void {
		let newPosition: number = this.checkBounds(this.currentPosition - 1);
		this.newMediaSelected(newPosition);
	}

	public toggleSlideshow(): void {
		if (this.slideshowTimer) {
			this.stopSlideShow();
		} else {
			this.startSlideshow();
		}
	}

	private startSlideshow(): void {
		this.slideshowTimer = window.setInterval(() => {
			this.nextMedia();
		}, this.slideshowMsPerMedia);
	}

	private stopSlideShow(): void {
		window.clearInterval(this.slideshowTimer);
		this.slideshowTimer = null;
	}

	private resetSlideshowTimer(): void {
		this.stopSlideShow();
		this.startSlideshow();
	}

	public rotateMedia(): void {
		let newRotation = this.media[this.currentPosition].rotation + this.defaultRotationDeg;
		if (newRotation >= 360) newRotation = 0;
		this.media[this.currentPosition].rotation = newRotation;

		this.onMediaRotate.emit(newRotation);
	}

	private findStartingPosition(): void {
		for (let i = 0; i < this.media.length; i++) {
			const media: Media = this.media[i];
			if (media.id === this.startingMedia.id) {
				this.currentPosition = i;
				break;
			}
		}
	}

	private newMediaSelected(mediaIndex: number): void {
		if (this.slideshowTimer) this.resetSlideshowTimer();

		this.currentPosition = mediaIndex;
		let newMedia: Media = this.media[mediaIndex];
		this.onMediaChange.emit(newMedia);
	}

	private checkBounds(newPosition: number): number {
		if (newPosition > this.media.length - 1) {
			return 0;
		} else if (newPosition < 0) {
			return this.media.length - 1;
		}

		return newPosition;
	}

	@HostListener('window:keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		let keyValue: string = event.key;
		if (keyValue === ' ') keyValue = 'Space';

		switch (keyValue) {
			case this.settingsService.settings.navigate_right_1:
			case this.settingsService.settings.navigate_right_2:
				this.nextMedia();
				break;
			case this.settingsService.settings.navigate_left_1:
			case this.settingsService.settings.navigate_left_2:
				this.previousMedia();
				break;
			case this.settingsService.settings.start_stop_slideshow_1:
			case this.settingsService.settings.start_stop_slideshow_2:
				this.toggleSlideshow();
				break;
		}
	}
}
