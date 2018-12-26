import { NgModule } from '@angular/core';

import {
	MatButtonModule,
	MatCardModule,
	MatDialogModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatProgressBarModule,
	MatSidenavModule,
	MatSnackBarModule
} from '@angular/material';

@NgModule({
	imports: [
		MatButtonModule,
		MatCardModule,
		MatDialogModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatProgressBarModule,
		MatSidenavModule,
		MatSnackBarModule
	],
	exports: [
		MatButtonModule,
		MatCardModule,
		MatDialogModule,
		MatIconModule,
		MatInputModule,
		MatListModule,
		MatProgressBarModule,
		MatSidenavModule,
		MatSnackBarModule
	]
})
export class ImageViewerMaterialModule { }
