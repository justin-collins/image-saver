import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MediaViewOptionsService } from 'src/app/core/services/mediaViewOptions.service';
import { MediaDisplayType } from 'src/app/core/types/mediaDisplayType';
import { MediaViewOption } from 'src/app/core/types/mediaViewOption';

@Component({
	selector: 'isvr-media-view-options',
	templateUrl: './media-view-options.component.html',
	styleUrls: ['./media-view-options.component.scss']
})
export class MediaViewOptionsComponent implements OnInit {
	@Output() viewOptionsUpdated = new EventEmitter<MediaViewOption>();

	public viewOptions: MediaViewOption;
	public mediaDisplayType = MediaDisplayType;

	constructor(private mediaViewOptionsService: MediaViewOptionsService) {
	}

	ngOnInit() {
		this.mediaViewOptionsService.mediaViewOptionsChanged.subscribe(this.overrideViewOptions);
	}

	private overrideViewOptions = (newViewOptions: MediaViewOption) => {
		this.viewOptions = newViewOptions;
	}

	public thumbSizeChanged(event): void {
		if (event && event.value) {
			this.viewOptions.thumbSize = event.value;
			this.viewOptionsChanged();
		}
	}

	public viewOptionsChanged(): void {
		this.mediaViewOptionsService.mediaViewOptions = this.viewOptions;
	}

	resetViewOptions(): void {
		this.mediaViewOptionsService.resetInitialViewOptions();
	}
}
