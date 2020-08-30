import { Component, OnInit } from '@angular/core';
import { ExportService, ExportOptions } from '../core/export.service';
import { ImportService } from '../core/import.service';
import { MessagingService } from '../core/messaging.service';

const { dialog } = require('electron').remote;

@Component({
	selector: 'isvr-import-export',
	templateUrl: './import-export.component.html',
	styleUrls: ['./import-export.component.scss']
})
export class ImportExportComponent implements OnInit {
	public importFile: string;
	public exportFolder: string;
	public exportOptions: ExportOptions = {
		includeLocalFiles: true
	};

	constructor(private exportService: ExportService,
				private importService: ImportService,
				private messagingService: MessagingService) { }

	ngOnInit(): void {
	}

	public openDirectoryDialog(): void {
		this.exportFolder = dialog.showOpenDialogSync({ properties:['openDirectory', 'createDirectory'] });
	}

	public openFileDialog(): void {
		this.importFile = dialog.showOpenDialogSync({ properties:['openFile'] });
	}

	public export(): void {
		this.exportService.export(this.exportFolder, this.exportOptions).subscribe(this.fileExported);
	}

	private fileExported = (): void => {
		this.messagingService.message('File Exported!');
		this.exportFolder = '';
	}

	public import(): void {
		this.importService.import(this.importFile).subscribe(this.fileImported);
	}

	private fileImported = (): void => {
		this.messagingService.message('File Imported!');
		this.importFile = '';
	}
}
