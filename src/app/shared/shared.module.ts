import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaPreviewComponent } from './media-preview/media-preview.component';
import { ImageViewerMaterialModule } from '../material.module';
import { NewMediaDialogComponent } from './new-media-dialog/new-media-dialog.component';
import { NewMediaButtonDirective } from './new-media-button.directive';
import { ConfirmButtonDirective } from './confirm-button.directive';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { TruncatePipe } from './truncate.pipe';
import { TagManagerComponent } from './tag-manager/tag-manager.component';
import { AlbumSelectorDialogComponent } from './album-selector-dialog/album-selector-dialog.component';
import { AlbumSelectorDirective } from './album-selector.directive';
import { AlbumManagerComponent } from './album-manager/album-manager.component';
import { RouterModule } from '@angular/router';
import { InitialCasePipe } from './initial-case.pipe';
import { NewTagDialogComponent } from './new-tag-dialog/new-tag-dialog.component';
import { NewTagButtonDirective } from './new-tag-button.directive';
import { TagAutocompleteComponent } from './tag-autocomplete/tag-autocomplete.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { MediaRendererComponent } from './media-renderer/media-renderer.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		ImageViewerMaterialModule,
		CoreModule,
		RouterModule
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
		MediaSelectorDirective,
		TruncatePipe,
		TagManagerComponent,
		AlbumSelectorDialogComponent,
		AlbumSelectorDirective,
		AlbumManagerComponent,
		InitialCasePipe,
		NewTagDialogComponent,
		NewTagButtonDirective,
		TagAutocompleteComponent,
		MainNavComponent,
		MediaRendererComponent
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
		MediaSelectorDirective,
		TruncatePipe,
		TagManagerComponent,
		AlbumSelectorDialogComponent,
		AlbumSelectorDirective,
		AlbumManagerComponent,
		InitialCasePipe,
		NewTagDialogComponent,
		NewTagButtonDirective,
		TagAutocompleteComponent,
		MainNavComponent,
		MediaRendererComponent
	],
	entryComponents: [
		NewMediaDialogComponent,
		ConfirmDialogComponent,
		NewAlbumDialogComponent,
		EditAlbumDialogComponent,
		MediaSelectorDialogComponent,
		AlbumSelectorDialogComponent,
		NewTagDialogComponent
	]
})
export class SharedModule { }
