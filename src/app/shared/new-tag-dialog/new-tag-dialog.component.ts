import { Component, OnInit, NgZone } from '@angular/core';
import { Tag } from 'src/app/core/tag';
import { MatDialogRef } from '@angular/material/dialog';
import { TagService } from 'src/app/core/tag.service';
import { MessagingService } from 'src/app/core/messaging.service';

@Component({
	selector: 'isvr-new-tag-dialog',
	templateUrl: './new-tag-dialog.component.html',
	styleUrls: ['./new-tag-dialog.component.scss']
})
export class NewTagDialogComponent implements OnInit {
	public newTag: Tag;

	constructor(public dialogRef: MatDialogRef<NewTagDialogComponent>,
				private tagService: TagService,
				private messagingService: MessagingService,
				private _ngZone: NgZone) {
		this.newTag = new Tag();
	}

	ngOnInit() {
	}

	public saveNewTag(): void {
		this.tagService.insert(this.newTag).subscribe(() => {
			this._ngZone.run(() => {
				this.messagingService.message('New Tag Created!');
				this.dialogRef.close(this.newTag);
			});
		});
	}
}
