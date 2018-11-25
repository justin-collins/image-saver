import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageViewerMaterialModule } from './material.module';
import { ISVRRoutingModule } from './app.routing';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		ISVRRoutingModule,
		ImageViewerMaterialModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
