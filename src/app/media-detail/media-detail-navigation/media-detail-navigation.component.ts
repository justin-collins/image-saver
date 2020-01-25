import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Media } from 'src/app/core/media';
import { Context } from 'src/app/core/context';
import { ContextService } from 'src/app/core/context.service';
import { MediaService, MediaFilter } from 'src/app/core/media.service';
import { ContextType } from 'src/app/core/contextType';

@Component({
	selector: 'isvr-media-detail-navigation',
	templateUrl: './media-detail-navigation.component.html',
	styleUrls: ['./media-detail-navigation.component.scss']
})
export class MediaDetailNavigationComponent implements OnInit {
	@Input() startingMedia: Media;
	@Output() onMediaChange = new EventEmitter<Media>();

	public context: Context;
	public media: Media[];
	public currentPosition: number = 0;
	public slideshowTimer;

	private slideshowMsPerMedia: number = 5000;

	constructor(private mediaService: MediaService,
				private contextService: ContextService) { }

	ngOnInit() {
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

	public slideshow(): void {
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
		this.slideshowTimer = null;
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
}
