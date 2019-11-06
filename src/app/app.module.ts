import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageViewerMaterialModule } from './material.module';
import { ISVRRoutingModule } from './app.routing';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MediaDetailComponent } from './media-detail/media-detail.component';

@NgModule({
	declarations: [
		AppComponent,
		DashboardComponent,
		MediaDetailComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		CoreModule,
		SharedModule,
		ISVRRoutingModule,
		ImageViewerMaterialModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
