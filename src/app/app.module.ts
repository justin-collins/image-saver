import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageViewerMaterialModule } from './material.module';
import { ISVRRoutingModule } from './app.routing';
import { MediaComponent } from './media/media.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaDetailComponent } from './media-detail/media-detail.component';
import { AlbumsComponent } from './albums/albums.component';
import { TrashComponent } from './trash/trash.component';
import { MediaDetailDrawerComponent } from './media-detail/media-detail-drawer/media-detail-drawer.component';
import { AlbumDetailsComponent } from './album-details/album-details.component';
import { TagsComponent } from './tags/tags.component';
import { MediaFiltersComponent } from './media/media-filters/media-filters.component';
import { AlbumFiltersComponent } from './albums/album-filters/album-filters.component';
import { TagFiltersComponent } from './tags/tag-filters/tag-filters.component';
import { MediaDetailNavigationComponent } from './media-detail/media-detail-navigation/media-detail-navigation.component';
import { SettingsComponent } from './settings/settings.component';
import { QuickStartDialogComponent } from './media/quick-start-dialog/quick-start-dialog.component';

@NgModule({
	declarations: [
		AppComponent,
		MediaComponent,
		MediaDetailComponent,
		AlbumsComponent,
		TrashComponent,
		MediaDetailDrawerComponent,
		AlbumDetailsComponent,
		TagsComponent,
		MediaFiltersComponent,
		AlbumFiltersComponent,
		TagFiltersComponent,
		MediaDetailNavigationComponent,
		SettingsComponent,
		QuickStartDialogComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		CoreModule,
		SharedModule,
		ISVRRoutingModule,
		ImageViewerMaterialModule
	],
	providers: [],
	bootstrap: [AppComponent],
	entryComponents: [
		QuickStartDialogComponent
	]
})
export class AppModule { }
