import { Component, OnInit, NgZone } from '@angular/core';
import { Album } from '../core/album';
import { AlbumService, AlbumFilter } from '../core/album.service';

@Component({
	selector: 'isvr-albums',
	templateUrl: './albums.component.html',
	styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {
	public albums: Album[];
	public numCols: number = 5;
	public filters: AlbumFilter;

	constructor(private albumService: AlbumService,
		private _ngZone: NgZone) {
			this.resetFilters();
	}

	ngOnInit() {
		this.loadAlbums(this.filters);
	}

	private loadAlbums(newFilter: AlbumFilter): void {
		this.albumService.getFiltered(newFilter).subscribe(this.albumsLoaded);
	}

	private albumsLoaded = (albumsResponse: Album[]): void => {
		this._ngZone.run(() => {
			this.albums = albumsResponse;
		});
	}

	public newAlbumAdded(newAlbum: Album): void {
		this._ngZone.run(() => {
			this.albums.unshift(newAlbum);
		});
	}

	public filtersChanged(newFilters: AlbumFilter): void {
		this.filters = newFilters;
		this.loadAlbums(this.filters);
	}

	private resetFilters(): void {
		this.filters = {
			term: ''
		};
	}

	private filtersAreEmpty(): boolean {
		if (this.filters.term) return false;
		return true;
	}
}
