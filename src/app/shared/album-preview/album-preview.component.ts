import { Component, OnInit, Input } from '@angular/core';
import { Album } from 'src/app/core/album';
import { MediaType } from 'src/app/core/mediaType';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'isvr-album-preview',
	templateUrl: './album-preview.component.html',
	styleUrls: ['./album-preview.component.scss']
})
export class AlbumPreviewComponent implements OnInit {
	@Input() album: Album;

	public mediaType = MediaType;

	constructor(private router: Router,
		private sanitizer: DomSanitizer) { }

	ngOnInit() {
		if (!this.album) {
			console.error('An album must be provided for the preview component');
		}
	}

	public navigateToDetails(): void {
		this.router.navigate(['/albums', this.album.id, 'detail']);
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
