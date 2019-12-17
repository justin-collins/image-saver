import { Directive, HostListener, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { TagSelectorDialogComponent } from './tag-selector-dialog/tag-selector-dialog.component';

@Directive({
	selector: '[isvrTagSelector]'
})
export class TagSelectorDirective {
	// @Output() tagsSelected = new EventEmitter<Media[]>();

	private tagSelectorDialogRef: MatDialogRef<TagSelectorDialogComponent>;
	private tagSelectorDialogConfig: MatDialogConfig = {
		width: '80%',
		maxHeight: '400px'
	};

	constructor(private dialog: MatDialog) { }

	@HostListener('click')
	private onClick() {
		if (this.tagSelectorDialogRef) return;

		this.tagSelectorDialogConfig.data = { };

		this.tagSelectorDialogRef = this.dialog.open(TagSelectorDialogComponent, this.tagSelectorDialogConfig);
		this.tagSelectorDialogRef.afterClosed().subscribe((result) => {
			// if (result) this.mediaSelected.emit(result);
			this.tagSelectorDialogRef = null;
		});
	}
}
