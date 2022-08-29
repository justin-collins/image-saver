import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { Album } from 'src/app/core/types/album';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlbumService } from 'src/app/core/services/album.service';

@Component({
	selector: 'isvr-album-selector-dialog',
	templateUrl: './album-selector-dialog.component.html',
	styleUrls: ['./album-selector-dialog.component.scss']
})
export class AlbumSelectorDialogComponent implements OnInit {
	public albums: Album[];
	public albumsSelected: Album[];
	public numCols: number = 4;

	constructor(@Inject(MAT_DIALOG_DATA) private data,
				private albumService: AlbumService,
				public dialogRef: MatDialogRef<AlbumSelectorDialogComponent>,
				private _ngZone: NgZone) {

	}

	ngOnInit() {
		this.albumsSelected = [];

		this.loadAlbums();
	}

	private loadAlbums(): void {
		this.albumService.getAll().subscribe(this.albumsLoaded);
	}

	private albumsLoaded = (albumResponse: Album[]): void => {
		this.albums = albumResponse;
	}

	public toggleAlbumSelection(selectedAlbum: Album): void {
		if (!this.albumSelectedContains(selectedAlbum)) {
			this.selectAlbum(selectedAlbum);
		} else {
			this.unSelectAlbum(selectedAlbum);
		}
	}

	private selectAlbum(selectedAlbum: Album): void {
		this.albumsSelected.push(selectedAlbum);
	}

	private unSelectAlbum(removeAlbum: Album): void {
		if (this.albumSelectedContains(removeAlbum)) {
			let index: number = this.albumsSelected.findIndex(album => album.id === removeAlbum.id);
			this.albumsSelected.splice(index, 1);
		}
	}

	public albumSelectedContains(theAlbum: Album): boolean {
		let index: number = this.albumsSelected.findIndex(album => album.id === theAlbum.id);
		return (index === -1)? false : true;
	}

	public albumsSelectionComplete(): void {
		this._ngZone.run(() => {
			this.dialogRef.close(this.albumsSelected);
		});
	}

	public newAlbumAdded = (newAlbum: Album): void => {
		this._ngZone.run(() => {
			this.albums.push(newAlbum);
			this.albumsSelected.push(newAlbum);
		});
	}

}
