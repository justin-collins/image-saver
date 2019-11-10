import { Directive, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Media } from '../core/media';
import { MediaSelectorDialogComponent } from './media-selector-dialog/media-selector-dialog.component';

@Directive({
	selector: '[isvrMediaSelector]'
})
export class MediaSelectorDirective {
	@Input() albumId: number;
	@Input() tagId: number;
	@Input() maxSelections: number;
	@Output() mediaSelected = new EventEmitter<Media[]>();

	private mediaSelectorDialogRef: MatDialogRef<MediaSelectorDialogComponent>;
	private mediaSelectorDialogConfig: MatDialogConfig = {
		width: '80%',
		maxHeight: '400px'
	};

	constructor(private dialog: MatDialog) { }

	@HostListener('click')
	private onClick() {
		if (this.mediaSelectorDialogRef) return;

		this.mediaSelectorDialogConfig.data = {
			albumId: this.albumId,
			tagId: this.tagId,
			maxSelections: this.maxSelections
		}

		this.mediaSelectorDialogRef = this.dialog.open(MediaSelectorDialogComponent, this.mediaSelectorDialogConfig);
		this.mediaSelectorDialogRef.afterClosed().subscribe((result) => {
			if (result) this.mediaSelected.emit(result);
			this.mediaSelectorDialogRef = null;
		});
	}
}
