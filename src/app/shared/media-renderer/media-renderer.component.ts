import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Media } from 'src/app/core/media';
import { MediaType } from 'src/app/core/mediaType';

@Component({
	selector: 'isvr-media-renderer',
	templateUrl: './media-renderer.component.html',
	styleUrls: ['./media-renderer.component.scss']
})
export class MediaRendererComponent implements OnInit {
	private _media: Media;
	public get media(): Media { return this._media;	}
	@Input() public set media(newMedia: Media) {
		this._media = newMedia;
		this.updateVideoUrl();
	}

	@Input() controls: boolean = false;
	@Input() autoplayVideos: boolean = true;

	public mediaType = MediaType;
	public safeVideoUrl: SafeResourceUrl;

	constructor(private sanitizer: DomSanitizer) { }

	ngOnInit(): void {}

	private updateVideoUrl(): void {
		if (this.media.type === MediaType.VIDEO) {
			this.safeVideoUrl = this.sanitizeVideoUrl(this.media.url);
		}
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
}
