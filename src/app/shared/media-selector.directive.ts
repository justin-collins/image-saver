import { Directive, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Media } from '../core/media';
import { MediaSelectorDialogComponent } from './media-selector-dialog/media-selector-dialog.component';
import { ContextType } from '../core/contextType';

@Directive({
	selector: '[isvrMediaSelector]'
})
export class MediaSelectorDirective {
	@Input() settings: MediaSelectorSettings;
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
			settings: this.settings
		}

		this.mediaSelectorDialogRef = this.dialog.open(MediaSelectorDialogComponent, this.mediaSelectorDialogConfig);
		this.mediaSelectorDialogRef.afterClosed().subscribe((result) => {
			if (result) this.mediaSelected.emit(result);
			this.mediaSelectorDialogRef = null;
		});
	}
}

export interface MediaSelectorSettings {
	dataId?: number,
	dataType?: ContextType,
	exclude?: boolean,
	maxSelections?: number
}
