import { Component, OnInit, Input, Output, EventEmitter, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Album, Context, ContextType, Media, MediaType } from '../../core/types';
import { AlbumService, ContextService, MediaService } from '../../core/services';

@Component({
	selector: 'isvr-media-preview',
	templateUrl: './media-preview.component.html',
	styleUrls: ['./media-preview.component.scss']
})
export class MediaPreviewComponent implements OnInit {
	@Input() media: Media;
	@Input() editable: boolean = true;
	@Input() navigable: boolean = true;
	@Output() mediaRemoved = new EventEmitter<Media>();

	public mediaType = MediaType;
	public contextType = ContextType;
	public context: Context;

	constructor(private mediaService: MediaService,
				private albumService: AlbumService,
				private contextService: ContextService,
				private router: Router,
				private _ngZone: NgZone) { }

	ngOnInit() {
		if (!this.media) {
			console.error('A media must be provided for the preview component');
		}
		this.contextService.contextChanged.subscribe(this.contextChanged);
	}

	private contextChanged = (newContext: Context): void => {
		this._ngZone.run(() => {
			this.context = newContext;
		});
	}

	public navigateToDetails(): void {
		if (!this.navigable) return;

		this.router.navigate(['/media', this.media.id, 'detail']);
	}

	public trashMedia(): void {
		this.mediaService.trash(this.media).subscribe(this.fireMediaRemoved);
	}

	public removeFromAlbum(): void {
		this.albumService.removeMedia(this.media, <Album>this.context.dataObject).subscribe(this.fireMediaRemoved);
	}

	private fireMediaRemoved = (): void => {
		this.mediaRemoved.emit(this.media);
	}

	public preventDefault(event): void {
		event.preventDefault();
		event.stopPropagation();
	}
}
