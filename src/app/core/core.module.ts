import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageViewerMaterialModule } from '../material.module';
import { 
	DatabaseService, 
	MessagingService,
	MediaService,
	AlbumService,
	ContextService,
	TagService,
	SettingsService,
	StartupService,
	ExportService,
	ImportService
} from './services';

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
		TagService,
		SettingsService,
		StartupService,
		ExportService,
		ImportService
	]
})
export class CoreModule { }
