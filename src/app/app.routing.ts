import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaComponent } from './media/media.component';
import { MediaDetailComponent } from './media-detail/media-detail.component';
import { AlbumsComponent } from './albums/albums.component';
import { TrashComponent } from './trash/trash.component';
import { AlbumDetailsComponent } from './album-details/album-details.component';
import { TagsComponent } from './tags/tags.component';

const routes: Routes = [
	{ path: '', redirectTo: '/media', pathMatch: 'full' },
	{
		path: 'media',
		component: MediaComponent
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
		path: 'tags',
		component: TagsComponent
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
