import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './database.service';
import { ImageViewerMaterialModule } from '../material.module';
import { MessagingService } from './messaging.service';
import { MediaService } from './media.service';
import { AlbumService } from './album.service';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		ImageViewerMaterialModule
	],
	providers: [
		DatabaseService,
		MessagingService,
		MediaService,
		AlbumService
	]
})
export class CoreModule { }
