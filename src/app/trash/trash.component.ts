import { Component, OnInit, NgZone } from '@angular/core';
import { Media } from '../core/media';
import { MediaService } from '../core/media.service';
import { MediaType } from '../core/mediaType';
import { Router } from '@angular/router';

@Component({
	selector: 'isvr-trash',
	templateUrl: './trash.component.html',
	styleUrls: ['./trash.component.scss']
})
export class TrashComponent implements OnInit {
	public trashedMedia: Media[];

	public mediaType = MediaType;

	constructor(private mediaService: MediaService,
				private _ngZone: NgZone,
				private router: Router) { }

	ngOnInit() {
		this.loadAllMedia();
	}

	private loadAllMedia(): void {
		this.mediaService.getTrashed().subscribe(this.mediaLoaded);
	}

	private mediaLoaded = (mediaResponse: Media[]): void => {
		this._ngZone.run(() => {
			this.trashedMedia = mediaResponse;
		});
	}

	public navigateToDetails(media: Media): void {
		this.router.navigate(['/media', media.id, 'detail']);
	}

	public permanentlyDelete(media: Media): void {
		this.mediaService.delete(media).subscribe(() => this.removeMediaFromList(media));
	}

	public permanentlyDeleteAll(): void {
		this.mediaService.deleteAllTrashed().subscribe(this.clearList);
	}

	public restore(media: Media): void {
		this.mediaService.restore(media).subscribe(this.removeMediaFromList);
	}

	private removeMediaFromList = (media: Media): void => {
		let index: number = this.trashedMedia.findIndex(med => med.id === media.id);

		if (index > -1) {
			this._ngZone.run(() => {
				this.trashedMedia.splice(index, 1);
			});
		}
	}

	private clearList = (): void => {
		this._ngZone.run(() => {
			this.trashedMedia = [];
		});
	}

	public preventDefault(event): void {
		event.preventDefault();
		event.stopPropagation();
	}
}
