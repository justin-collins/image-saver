import { Component, OnInit, NgZone } from '@angular/core';
import { Album } from '../core/album';
import { AlbumService } from '../core/album.service';
import { ActivatedRoute } from '@angular/router';
import { Media } from '../core/media';

@Component({
	selector: 'isvr-album-details',
	templateUrl: './album-details.component.html',
	styleUrls: ['./album-details.component.scss']
})
export class AlbumDetailsComponent implements OnInit {
	public album: Album;
	public media: Media[];

	public numCols: number = 5;

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

	private albumLoaded = (albumResponse: Album): void => {
		this._ngZone.run(() => {
			this.album = albumResponse;
			this.loadAlbumMedia();
		});
	}

	private loadAlbumMedia(): void {
		this.albumService.getAllMedia(this.album).subscribe(this.mediaLoaded);
	}

	private mediaLoaded = (mediaResponse: Media[]): void => {
		this._ngZone.run(() => {
			this.media = mediaResponse;
		});
	}

	public albumEdited(editedAlbum: Album): void {
		this.album = editedAlbum;
	}

	public mediaRemoved(removeMedia: Media): void {
		let index: number = this.media.findIndex(med => med.id === removeMedia.id);

		if (index > -1) {
			this.media.splice(index, 1);
		}
	}
}
