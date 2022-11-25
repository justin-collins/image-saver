import { Directive, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditAlbumDialogComponent } from './edit-album-dialog/edit-album-dialog.component';
import { Album } from '../core/types';

@Directive({
	selector: '[isvrEditAlbumButton]'
})
export class EditAlbumButtonDirective {
	@Input() album: Album;
	@Output() albumSaved = new EventEmitter<Album>();

	private editAlbumDialogRef: MatDialogRef<EditAlbumDialogComponent>;
	private editAlbumDialogConfig: MatDialogConfig = { };

	constructor(private dialog: MatDialog) { }

	@HostListener('click')
	private onClick() {
		if (this.editAlbumDialogRef) return;

		this.editAlbumDialogConfig.data = {album: this.album};

		this.editAlbumDialogRef = this.dialog.open(EditAlbumDialogComponent, this.editAlbumDialogConfig);
		this.editAlbumDialogRef.afterClosed().subscribe((result) => {
			if (result) this.albumSaved.emit(result);
			this.editAlbumDialogRef = null;
		});
	}
}
