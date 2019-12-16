import { Directive, HostListener, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { AlbumSelectorDialogComponent } from './album-selector-dialog/album-selector-dialog.component';
import { Album } from '../core/album';

@Directive({
	selector: '[isvrAlbumSelector]'
})
export class AlbumSelectorDirective {
	@Output() albumsSelected = new EventEmitter<Album[]>();

	private albumSelectorDialogRef: MatDialogRef<AlbumSelectorDialogComponent>;
	private albumSelectorDialogConfig: MatDialogConfig = {
		width: '80%',
		maxHeight: '400px'
	};

	constructor(private dialog: MatDialog) { }

	@HostListener('click')
	private onClick() {
		if (this.albumSelectorDialogRef) return;

		this.albumSelectorDialogConfig.data = { };

		this.albumSelectorDialogRef = this.dialog.open(AlbumSelectorDialogComponent, this.albumSelectorDialogConfig);
		this.albumSelectorDialogRef.afterClosed().subscribe((result) => {
			if (result) this.albumsSelected.emit(result);
			this.albumSelectorDialogRef = null;
		});
	}
}
