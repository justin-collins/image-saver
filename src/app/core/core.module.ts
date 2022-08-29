import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from './services/database.service';
import { ImageViewerMaterialModule } from '../material.module';
import { MessagingService } from './services/messaging.service';
import { MediaService } from './services/media.service';
import { AlbumService } from './services/album.service';
import { ContextService } from './services/context.service';
import { TagService } from './services/tag.service';
import { SettingsService } from './services/settings.service';
import { StartupService } from './services/startup.service';
import { ExportService } from './services/export.service';
import { ImportService } from './services/import.service';

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
