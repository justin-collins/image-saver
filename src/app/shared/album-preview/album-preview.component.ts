import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Album, MediaType } from 'src/app/core/types';

@Component({
	selector: 'isvr-album-preview',
	templateUrl: './album-preview.component.html',
	styleUrls: ['./album-preview.component.scss']
})
export class AlbumPreviewComponent implements OnInit {
	@Input() album: Album;

	public mediaType = MediaType;

	constructor(private router: Router) { }

	ngOnInit() {
		if (!this.album) {
			console.error('An album must be provided for the preview component');
		}
	}

	public navigateToDetails(): void {
		this.router.navigate(['/albums', this.album.id, 'detail']);
	}
}
