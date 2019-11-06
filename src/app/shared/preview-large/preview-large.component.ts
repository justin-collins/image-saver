import { Component, OnInit, Input } from '@angular/core';
import { Media } from 'src/app/core/media';
import { Router } from '@angular/router';

@Component({
	selector: 'isvr-preview-large',
	templateUrl: './preview-large.component.html',
	styleUrls: ['./preview-large.component.scss']
})
export class PreviewLargeComponent implements OnInit {
	@Input() media: Media;

	constructor(private router: Router) { }

	ngOnInit() {
		if (!this.media) {
			console.error('A media must be provided for the preview component');
		}
	}

	public navigateToDetails(): void {
		this.router.navigate(['/media', this.media.id, 'detail']);
	}
}
