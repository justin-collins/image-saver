import { Component, OnInit } from '@angular/core';
import { ImportService, MessagingService, ExportService, ExportOptions } from '../core/services';

// import { dialog } from '@electron/remote';

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
		// TODO check back when electron remote updated past 2.0.8
		// this.exportFolder = dialog.showOpenDialogSync({ properties:['openDirectory', 'createDirectory'] })[0];
	}

	public openFileDialog(): void {
		// TODO check back when electron remote updated past 2.0.8
		// this.importFile = dialog.showOpenDialogSync({ properties:['openFile'] })[0];
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
