import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewLargeComponent } from './preview-large/preview-large.component';
import { ImageViewerMaterialModule } from '../material.module';
import { NewMediaDialogComponent } from './new-media-dialog/new-media-dialog.component';
import { NewMediaButtonDirective } from './new-media-button.directive';
import { ConfirmButtonDirective } from './confirm-button.directive';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { CoreModule } from '../core/core.module';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ImageViewerMaterialModule,
		CoreModule
	],
	exports: [
		PreviewLargeComponent,
		NewMediaDialogComponent,
		NewMediaButtonDirective,
		ConfirmDialogComponent,
		ConfirmButtonDirective,
		AlertComponent
	],
	declarations: [
		PreviewLargeComponent,
		NewMediaButtonDirective,
		NewMediaDialogComponent,
		ConfirmButtonDirective,
		ConfirmDialogComponent,
		AlertComponent
	],
	entryComponents: [
		NewMediaDialogComponent,
		ConfirmDialogComponent
	]
})
export class SharedModule { }
