import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaPreviewComponent } from './media-preview/media-preview.component';
import { ImageViewerMaterialModule } from '../material.module';
import { NewMediaDialogComponent } from './new-media-dialog/new-media-dialog.component';
import { NewMediaButtonDirective } from './new-media-button.directive';
import { ConfirmButtonDirective } from './confirm-button.directive';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { CoreModule } from '../core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlbumPreviewComponent } from './album-preview/album-preview.component';
import { NewAlbumDialogComponent } from './new-album-dialog/new-album-dialog.component';
import { NewAlbumButtonDirective } from './new-album-button.directive';
import { MediaSelectorDialogComponent } from './media-selector-dialog/media-selector-dialog.component';
import { EditAlbumDialogComponent } from './edit-album-dialog/edit-album-dialog.component';
import { EditAlbumButtonDirective } from './edit-album-button.directive';
import { MediaSelectorDirective } from './media-selector.directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		BrowserAnimationsModule,
		ImageViewerMaterialModule,
		CoreModule
	],
	exports: [
		MediaPreviewComponent,
		NewMediaDialogComponent,
		NewMediaButtonDirective,
		ConfirmDialogComponent,
		ConfirmButtonDirective,
		AlertComponent,
		AlbumPreviewComponent,
		NewAlbumButtonDirective,
		NewAlbumDialogComponent,
		MediaSelectorDialogComponent,
		EditAlbumDialogComponent,
		EditAlbumButtonDirective,
		MediaSelectorDirective
	],
	declarations: [
		MediaPreviewComponent,
		NewMediaButtonDirective,
		NewMediaDialogComponent,
		ConfirmButtonDirective,
		ConfirmDialogComponent,
		AlertComponent,
		AlbumPreviewComponent,
		NewAlbumButtonDirective,
		NewAlbumDialogComponent,
		MediaSelectorDialogComponent,
		EditAlbumDialogComponent,
		EditAlbumButtonDirective,
		MediaSelectorDirective
	],
	entryComponents: [
		NewMediaDialogComponent,
		ConfirmDialogComponent,
		NewAlbumDialogComponent,
		EditAlbumDialogComponent,
		MediaSelectorDialogComponent
	]
})
export class SharedModule { }
