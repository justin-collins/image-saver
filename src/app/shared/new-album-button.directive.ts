import { Directive, Output, EventEmitter, HostListener } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewAlbumDialogComponent } from './new-album-dialog/new-album-dialog.component';
import { Album } from '../core/types';

@Directive({
	selector: '[isvrNewAlbumButton]'
})
export class NewAlbumButtonDirective {
	@Output() albumSaved = new EventEmitter<Album>();

	private newAlbumDialogRef: MatDialogRef<NewAlbumDialogComponent>;
	private newAlbumDialogConfig: MatDialogConfig = {
		hasBackdrop: false,
		position: {
			bottom: '0px',
			right: '100px'
		}
	};

	constructor(private dialog: MatDialog) { }

	@HostListener('click')
	private onClick() {
		if (this.newAlbumDialogRef) return;

		this.newAlbumDialogRef = this.dialog.open(NewAlbumDialogComponent, this.newAlbumDialogConfig);
		this.newAlbumDialogRef.afterClosed().subscribe((result) => {
			if (result) this.albumSaved.emit(result);
			this.newAlbumDialogRef = null;
		});
	}
}
