import { Component, OnInit, Input } from '@angular/core';
import { Album } from 'src/app/core/types/album';
import { MediaType } from 'src/app/core/types/mediaType';
import { Router } from '@angular/router';

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
