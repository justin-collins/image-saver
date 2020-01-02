import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageViewerMaterialModule } from './material.module';
import { ISVRRoutingModule } from './app.routing';
import { MediaComponent } from './media/media.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MediaDetailComponent } from './media-detail/media-detail.component';
import { AlbumsComponent } from './albums/albums.component';
import { TrashComponent } from './trash/trash.component';
import { MediaDetailDrawerComponent } from './media-detail/media-detail-drawer/media-detail-drawer.component';
import { AlbumDetailsComponent } from './album-details/album-details.component';
import { TagsComponent } from './tags/tags.component';

@NgModule({
	declarations: [
		AppComponent,
		MediaComponent,
		MediaDetailComponent,
		AlbumsComponent,
		TrashComponent,
		MediaDetailDrawerComponent,
		AlbumDetailsComponent,
		TagsComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		CoreModule,
		SharedModule,
		ISVRRoutingModule,
		ImageViewerMaterialModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
