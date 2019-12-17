import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'isvr-tag-selector-dialog',
	templateUrl: './tag-selector-dialog.component.html',
	styleUrls: ['./tag-selector-dialog.component.scss']
})
export class TagSelectorDialogComponent implements OnInit {

	constructor(@Inject(MAT_DIALOG_DATA) private data) { }

	ngOnInit() {
	}

}
