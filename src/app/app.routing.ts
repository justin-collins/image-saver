import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MediaComponent } from './media/media.component';
import { MediaDetailComponent } from './media-detail/media-detail.component';
import { AlbumsComponent } from './albums/albums.component';
import { TrashComponent } from './trash/trash.component';
import { AlbumDetailsComponent } from './album-details/album-details.component';
import { TagsComponent } from './tags/tags.component';
import { SettingsComponent } from './settings/settings.component';
import { UnlockComponent } from './unlock/unlock.component';
import { UnlockedGuard } from './core/unlocked.guard';

const routes: Routes = [
	{ path: '', redirectTo: '/unlock', pathMatch: 'full' },
	{
		path: 'unlock',
		component: UnlockComponent
	},
	{
		path: 'media',
		canActivate: [UnlockedGuard],
		component: MediaComponent
	},
	{
		path: 'media/:mediaId/detail',
		canActivate: [UnlockedGuard],
		component: MediaDetailComponent
	},
	{
		path: 'albums',
		canActivate: [UnlockedGuard],
		component: AlbumsComponent
	},
	{
		path: 'albums/:albumId/detail',
		canActivate: [UnlockedGuard],
		component: AlbumDetailsComponent
	},
	{
		path: 'tags',
		canActivate: [UnlockedGuard],
		component: TagsComponent
	},
	{
		path: 'trash',
		canActivate: [UnlockedGuard],
		component: TrashComponent
	},
	{
		path: 'settings',
		canActivate: [UnlockedGuard],
		component: SettingsComponent
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
