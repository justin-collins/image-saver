import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './database.service';
import { ImageViewerMaterialModule } from '../material.module';
import { MessagingService } from './messaging.service';
import { MediaService } from './media.service';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		ImageViewerMaterialModule
	],
	providers: [
		DatabaseService,
		MessagingService,
		MediaService
	]
})
export class CoreModule { }
