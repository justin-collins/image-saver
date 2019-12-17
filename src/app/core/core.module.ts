import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './database.service';
import { ImageViewerMaterialModule } from '../material.module';
import { MessagingService } from './messaging.service';
import { MediaService } from './media.service';
import { AlbumService } from './album.service';
import { ContextService } from './context.service';
import { TagService } from './tag.service';

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
		AlbumService,
		ContextService,
		TagService
	]
})
export class CoreModule { }
