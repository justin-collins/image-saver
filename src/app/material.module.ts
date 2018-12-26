import { NgModule } from '@angular/core';

import {
	MatButtonModule,
	MatProgressBarModule,
	MatSidenavModule
} from '@angular/material';

@NgModule({
	imports: [
		MatButtonModule,
		MatProgressBarModule,
		MatSidenavModule
	],
	exports: [
		MatButtonModule,
		MatProgressBarModule,
		MatSidenavModule
	]
})
export class ImageViewerMaterialModule { }
