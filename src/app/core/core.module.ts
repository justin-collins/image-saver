import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './database.service';
import { ImageViewerMaterialModule } from '../material.module';
import { MessagingService } from './messaging.service';
import { MediaService } from './media.service';
import { AlbumService } from './album.service';
import { ContextService } from './context.service';
import { TagService } from './tag.service';
import { SettingsService } from './settings.service';
import { StartupService } from './startup.service';
import { ExportService } from './export.service';
import { ImportService } from './import.service';

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
