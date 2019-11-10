import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Media } from 'src/app/core/media';
import { Router } from '@angular/router';
import { MediaType } from 'src/app/core/mediaType';
import { MediaService } from 'src/app/core/media.service';

export enum PreviewContext {
	LIST = 'LIST',
	ALBUM = 'ALBUM'
}

@Component({
	selector: 'isvr-media-preview',
	templateUrl: './media-preview.component.html',
	styleUrls: ['./media-preview.component.scss']
})
export class MediaPreviewComponent implements OnInit {
	@Input() media: Media;
	@Input() editable: boolean = true;
	@Input() navigable: boolean = true;
	@Input() context: PreviewContext = PreviewContext.LIST;
	@Output() mediaRemoved = new EventEmitter<Media>();

	public mediaType = MediaType;
	public previewContext = PreviewContext;

	constructor(private mediaService: MediaService,
				private router: Router) { }

	ngOnInit() {
		if (!this.media) {
			console.error('A media must be provided for the preview component');
		}
	}

	public navigateToDetails(): void {
		if (!this.navigable) return;

		this.router.navigate(['/media', this.media.id, 'detail']);
	}

	public trashMedia(): void {
		this.mediaService.trash(this.media).subscribe(this.trashed);
	}

	public trashed = (): void => {
		this.mediaRemoved.emit(this.media);
	}

	public preventDefault(event): void {
		event.preventDefault();
		event.stopPropagation();
	}
}
