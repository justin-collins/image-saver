import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Media } from 'src/app/core/media';
import { Router } from '@angular/router';
import { MediaType } from 'src/app/core/mediaType';
import { MediaService } from 'src/app/core/media.service';

@Component({
	selector: 'isvr-preview-large',
	templateUrl: './preview-large.component.html',
	styleUrls: ['./preview-large.component.scss']
})
export class PreviewLargeComponent implements OnInit {
	@Input() media: Media;
	@Output() mediaTrashed = new EventEmitter<Media>();

	public mediaType = MediaType;

	constructor(private mediaService: MediaService,
				private router: Router) { }

	ngOnInit() {
		if (!this.media) {
			console.error('A media must be provided for the preview component');
		}
	}

	public navigateToDetails(): void {
		this.router.navigate(['/media', this.media.id, 'detail']);
	}

	public trashMedia(): void {
		this.mediaService.trash(this.media).subscribe(this.trashed);
	}

	public trashed = (): void => {
		this.mediaTrashed.emit(this.media);
	}

	public preventDefault(event): void {
		event.preventDefault();
		event.stopPropagation();
	}
}
