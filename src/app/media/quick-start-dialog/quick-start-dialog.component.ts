import { Component, OnInit, NgZone } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DatabaseService } from 'src/app/core/services/database.service';

@Component({
	selector: 'isvr-quick-start-dialog',
	templateUrl: './quick-start-dialog.component.html',
	styleUrls: ['./quick-start-dialog.component.scss']
})
export class QuickStartDialogComponent implements OnInit {
	private quickStartFileName: string = 'quickStart.sql';

	constructor(public dialogRef: MatDialogRef<QuickStartDialogComponent>,
				private _ngZone: NgZone) { }

	ngOnInit() {
	}

	public runQuickStart(): void {
		DatabaseService.runFile(this.quickStartFileName).subscribe(this.quickStartRun);
	}

	private quickStartRun = (): void => {
		this._ngZone.run(() => {
			this.dialogRef.close(true);
		});
	}
}
