import { Component, OnInit, NgZone } from '@angular/core';
import { Album } from '../core/album';
import { AlbumService } from '../core/album.service';
import { ActivatedRoute } from '@angular/router';
import { Media } from '../core/media';
import { ContextService } from '../core/context.service';
import { MediaService } from '../core/media.service';
import { MediaSelectorSettings } from '../shared/media-selector.directive';
import { ContextType } from '../core/contextType';

@Component({
	selector: 'isvr-album-details',
	templateUrl: './album-details.component.html',
	styleUrls: ['./album-details.component.scss']
})
export class AlbumDetailsComponent implements OnInit {
	public album: Album;
	public media: Media[];

	public numCols: number = 5;

	public mediaSelectorSettings: MediaSelectorSettings;

	constructor(private albumService: AlbumService,
		private mediaService: MediaService,
		private contextService: ContextService,
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
			this.contextService.setContextAlbum(this.album);
			this.setupMediaSelectorSettings();
			this.loadAlbumMedia();
		});
	}

	private setupMediaSelectorSettings(): void {
		this.mediaSelectorSettings = {
			dataId: this.album.id,
			dataType: ContextType.ALBUM,
			exclude: true
		}
	}

	private loadAlbumMedia(): void {
		this.mediaService.getByAlbumId(this.album.id).subscribe(this.mediaLoaded);
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

		if (index > -1) this.media.splice(index, 1);
	}

	public addMediaToAlbum(newMedia: Media[]): void {
		this.albumService.addMedia(this.album, newMedia).subscribe(this.mediaAddedToAlbum);
	}

	private mediaAddedToAlbum = (newMedia: Media | Media[]): void => {
		this._ngZone.run(() => {
			if (newMedia instanceof Array) {
				this.media = [...newMedia, ...this.media];
			} else {
				this.media.unshift(newMedia);
			}
		});
	}
}
