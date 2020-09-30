import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Media } from 'src/app/core/media';
import { Router } from '@angular/router';
import { MediaType } from 'src/app/core/mediaType';
import { MediaService } from 'src/app/core/media.service';
import { ContextService } from 'src/app/core/context.service';
import { Context } from 'src/app/core/context';
import { ContextType } from 'src/app/core/contextType';
import { AlbumService } from 'src/app/core/album.service';
import { Album } from 'src/app/core/album';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'isvr-media-preview',
	templateUrl: './media-preview.component.html',
	styleUrls: ['./media-preview.component.scss']
})
export class MediaPreviewComponent implements OnInit {
	@Input() media: Media;
	@Input() editable: boolean = true;
	@Input() navigable: boolean = true;
	@Output() mediaRemoved = new EventEmitter<Media>();

	public mediaType = MediaType;
	public contextType = ContextType;
	public context: Context;
	public autoplayVideos: boolean = true;

	constructor(private mediaService: MediaService,
				private albumService: AlbumService,
				private contextService: ContextService,
				private sanitizer: DomSanitizer,
				private router: Router,
				private _ngZone: NgZone) { }

	ngOnInit() {
		if (!this.media) {
			console.error('A media must be provided for the preview component');
		}
		this.contextService.contextChanged.subscribe(this.contextChanged);
	}

	private contextChanged = (newContext: Context): void => {
		this._ngZone.run(() => {
			this.context = newContext;
		});
	}

	public navigateToDetails(): void {
		if (!this.navigable) return;

		this.router.navigate(['/media', this.media.id, 'detail']);
	}

	public trashMedia(): void {
		this.mediaService.trash(this.media).subscribe(this.fireMediaRemoved);
	}

	public removeFromAlbum(): void {
		this.albumService.removeMedia(this.media, <Album>this.context.dataObject).subscribe(this.fireMediaRemoved);
	}

	private fireMediaRemoved = (): void => {
		this.mediaRemoved.emit(this.media);
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

	public preventDefault(event): void {
		event.preventDefault();
		event.stopPropagation();
	}
}
