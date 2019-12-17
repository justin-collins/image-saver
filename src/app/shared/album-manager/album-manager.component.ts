import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Album } from 'src/app/core/album';
import { AlbumService } from 'src/app/core/album.service';
import { Media } from 'src/app/core/media';
import { Router } from '@angular/router';

@Component({
	selector: 'isvr-album-manager',
	templateUrl: './album-manager.component.html',
	styleUrls: ['./album-manager.component.scss']
})
export class AlbumManagerComponent implements OnInit {
	@Input() media: Media;

	public albums: Album[];

	constructor(private albumService: AlbumService,
				private _ngZone: NgZone,
				private router: Router) { }

	ngOnInit() {
		this.loadAlbums();
	}

	private loadAlbums(): void {
		this.albumService.getAlbumsByMedia(this.media).subscribe(this.albumsLoaded);
	}

	private albumsLoaded = (albumsResponse: Album[]): void => {
		this._ngZone.run(() => {
			this.albums = albumsResponse;
		});
	}

	public addToAlbum(newAlbums: Album[]): void {
		for (let i = 0; i < newAlbums.length; i++) {
			this.albums.push(newAlbums[i]);
			this.albumService.addMedia(newAlbums[i], this.media).subscribe(this.mediaAddedToAlbum);
		}

		this._ngZone.run(() => { });
	}

	public newAlbumCreated (newAlbum: Album): void {
		this.addToAlbum([newAlbum]);
	}

	private mediaAddedToAlbum = (newMedia: Media | Media[]): void => {
	}

	public removeFromAlbum(album: Album): void {
		this.albumService.removeMedia(this.media, album).subscribe(this.removedFromAlbum);
	}

	private removedFromAlbum = (removeAlbum: Album): void => {
		this._ngZone.run(() => {
			let index: number = this.albums.findIndex(album => album.id === removeAlbum.id);

			if (index > -1) this.albums.splice(index, 1);
		});
	}

	public navigateToAlbum(album: Album): void {
		this.router.navigate(['/albums', album.id, 'detail']);
	}

	public preventDefault(event): void {
		event.preventDefault();
		event.stopPropagation();
	}
}