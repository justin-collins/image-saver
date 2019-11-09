import { Component, OnInit, NgZone } from '@angular/core';
import { Album } from '../core/album';
import { AlbumService } from '../core/album.service';

@Component({
	selector: 'isvr-albums',
	templateUrl: './albums.component.html',
	styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {
	public albums: Album[];

	public numCols: number = 5;

	constructor(private albumService: AlbumService,
		private _ngZone: NgZone) { }

	ngOnInit() {
		this.loadAllAlbums();
	}

	private loadAllAlbums(): void {
		this.albumService.getAll().subscribe(this.albumsLoaded);
	}

	private albumsLoaded = (albumsResponse: Album[]): void => {
		this._ngZone.run(() => {
			this.albums = albumsResponse;
		});
	}

	public newAlbumAdded(newAlbum: Album): void {
		this.albums.unshift(newAlbum);
	}
}
