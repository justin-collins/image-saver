import { Component, OnInit, NgZone } from '@angular/core';
import { Album } from '../core/album';
import { AlbumService } from '../core/album.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'isvr-album-details',
	templateUrl: './album-details.component.html',
	styleUrls: ['./album-details.component.scss']
})
export class AlbumDetailsComponent implements OnInit {
	public album: Album;

	constructor(private albumService: AlbumService,
		private activatedRoute: ActivatedRoute,
		private _ngZone: NgZone) {
		this.activatedRoute.params.subscribe(this.initialize);
	}

	ngOnInit() {
	}

	private initialize = (params): void => {
		let albumId: number = params['albumId'];

		if (!albumId) console.error('Invalid albumId in URL');

		this.loadAlbum(albumId);
	}

	private loadAlbum(albumId: number): void {
		this.albumService.get(albumId).subscribe(this.albumLoaded);
	}

	private albumLoaded = (albumResponse): void => {
		this._ngZone.run(() => {
			this.album = albumResponse;
		});
	}

}
