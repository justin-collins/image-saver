import { Directive, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Directive({
	selector: '[isvrConfirmButton]'
})
export class ConfirmButtonDirective {
	@Input() message: string = 'Are you sure?';
	@Output() onConfirmed = new EventEmitter<boolean>();

	private confirmationDialogRef: MatDialogRef<ConfirmDialogComponent>;

	constructor(private dialog: MatDialog) { }

	@HostListener('click')
	private onClick() {
		this.confirmationDialogRef = this.dialog.open(ConfirmDialogComponent, { data: this.message });
		this.confirmationDialogRef.afterClosed().subscribe((result) => {
			if (result) this.onConfirmed.emit(true);
		});
	}
}
