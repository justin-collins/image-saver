import { Directive, Output, EventEmitter, HostListener } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Tag } from '../core/tag';
import { NewTagDialogComponent } from './new-tag-dialog/new-tag-dialog.component';

@Directive({
	selector: '[isvrNewTagButton]'
})
export class NewTagButtonDirective {
	@Output() tagSaved = new EventEmitter<Tag>();

	private newTagDialogRef: MatDialogRef<NewTagDialogComponent>;
	private newTagDialogConfig: MatDialogConfig = {
		hasBackdrop: false,
		position: {
			bottom: '0px',
			right: '100px'
		}
	};

	constructor(private dialog: MatDialog) { }

	@HostListener('click')
	private onClick() {
		if (this.newTagDialogRef) return;

		this.newTagDialogRef = this.dialog.open(NewTagDialogComponent, this.newTagDialogConfig);
		this.newTagDialogRef.afterClosed().subscribe((result) => {
			if (result) this.tagSaved.emit(result);
			this.newTagDialogRef = null;
		});
	}
}
