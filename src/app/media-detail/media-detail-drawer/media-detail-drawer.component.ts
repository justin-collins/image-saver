import { Component, OnInit, Input } from '@angular/core';
import { Media } from 'src/app/core/media';
import { AlbumService } from 'src/app/core/album.service';
import { Album } from 'src/app/core/album';

var shell = require('electron').shell;

@Component({
	selector: 'isvr-media-detail-drawer',
	templateUrl: './media-detail-drawer.component.html',
	styleUrls: ['./media-detail-drawer.component.scss']
})
export class MediaDetailDrawerComponent implements OnInit {
	@Input() media: Media;

	public albums: Album[];

	constructor(private albumService: AlbumService) { }

	ngOnInit() {
		if (!this.media) {
			console.error('A media must be provided for the media detail drawer component');
		}

		this.getAlbums();
	}

	private getAlbums(): void {
		this.albumService.getAlbumsByMedia(this.media).subscribe(this.albumsLoaded);
	}

	private albumsLoaded = (albumsResponse: Album[]): void => {
		this.albums = albumsResponse;
	}

	public openSource(): void {
		shell.openExternal(this.media.source);
	}
}
