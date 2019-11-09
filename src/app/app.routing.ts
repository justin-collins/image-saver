import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MediaDetailComponent } from './media-detail/media-detail.component';
import { AlbumsComponent } from './albums/albums.component';
import { TrashComponent } from './trash/trash.component';
import { AlbumDetailsComponent } from './album-details/album-details.component';

const routes: Routes = [
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{
		path: 'dashboard',
		component: DashboardComponent
	},
	{
		path: 'media/:mediaId/detail',
		component: MediaDetailComponent
	},
	{
		path: 'albums',
		component: AlbumsComponent
	},
	{
		path: 'albums/:albumId/detail',
		component: AlbumDetailsComponent
	},
	{
		path: 'trash',
		component: TrashComponent
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [
		RouterModule
	],
	declarations: []
})
export class ISVRRoutingModule { }
