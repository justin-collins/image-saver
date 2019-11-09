import { Directive, Output, EventEmitter, HostListener } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewMediaDialogComponent } from './new-media-dialog/new-media-dialog.component';

@Directive({
	selector: '[isvrNewMediaButton]'
})
export class NewMediaButtonDirective {
	@Output() mediaSaved = new EventEmitter<boolean>();

	private newMediaDialogRef: MatDialogRef<NewMediaDialogComponent>;
	private newMediaDialogConfig: MatDialogConfig = {
		hasBackdrop: false,
		position: {
			bottom: '0px',
			right: '100px'
		}
	};

	constructor(private dialog: MatDialog) { }

	@HostListener('click')
	private onClick() {
		if (this.newMediaDialogRef) return;

		this.newMediaDialogRef = this.dialog.open(NewMediaDialogComponent, this.newMediaDialogConfig);
		this.newMediaDialogRef.afterClosed().subscribe((result) => {
			if (result) this.mediaSaved.emit(result);
			this.newMediaDialogRef = null;
		});
	}
}
