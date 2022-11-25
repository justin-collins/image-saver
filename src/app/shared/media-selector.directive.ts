import { Directive, Output, EventEmitter, HostListener, Input } from '@angular/core';
import { MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MediaSelectorDialogComponent } from './media-selector-dialog/media-selector-dialog.component';
import { ContextType, Media } from '../core/types';

@Directive({
	selector: '[isvrMediaSelector]'
})
export class MediaSelectorDirective {
	@Input() settings: MediaSelectorSettings;
	@Output() mediaSelected = new EventEmitter<Media[]>();
	@Output() modalClosed = new EventEmitter<boolean>();

	private mediaSelectorDialogRef: MatDialogRef<MediaSelectorDialogComponent>;
	private mediaSelectorDialogConfig: MatDialogConfig = {
		width: '80%',
		height: '80%'
	};

	constructor(private dialog: MatDialog) { }

	@HostListener('click')
	private onClick() {
		if (this.mediaSelectorDialogRef) return;

		this.mediaSelectorDialogConfig.data = {
			settings: this.settings
		};

		this.mediaSelectorDialogRef = this.dialog.open(MediaSelectorDialogComponent, this.mediaSelectorDialogConfig);
		this.mediaSelectorDialogRef.afterClosed().subscribe((result) => {
			if (result) this.mediaSelected.emit(result);
			this.modalClosed.emit(true);
			this.mediaSelectorDialogRef = null;
		});
	}
}

export interface MediaSelectorSettings {
	dataId?: number,
	dataType?: ContextType,
	exclude?: boolean,
	maxSelections?: number,
	showFilters?: boolean
}
