import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { StartupService } from '../core/startup.service';
import { Router } from '@angular/router';
import { MessagingService } from '../core/messaging.service';
@Component({
	selector: 'isvr-unlock',
	templateUrl: './unlock.component.html',
	styleUrls: ['./unlock.component.scss']
})
export class UnlockComponent implements OnInit {
	public passKey: string;
	public error: boolean = false;

	@ViewChild('passKeyInput') passKeyInput: ElementRef;

	constructor(private startupService: StartupService,
		private messagingService: MessagingService,
		private _ngZone: NgZone,
		private router: Router) { }

	ngOnInit(): void {
		this._ngZone.run(() => {
			setTimeout(_ => this.passKeyInput.nativeElement.focus(), 10);
		});
	}

	public unlock(): void {
		let escapedPassKey: string = escape(this.passKey);
		this.startupService.startupDatabase(escapedPassKey).subscribe(this.unlocked, this.unlockError);
	}

	private unlocked = (): void => {
		this.startupService.unlocked = true;
		this.messagingService.message('Unlocked!');
		this.startupService.initialize().subscribe(() => {
			this._ngZone.run(() => {
				this.router.navigate(['/media']);
			});
		});
	}

	private unlockError = (): void => {
		this._ngZone.run(() => {
			this.error = true;
		});
	}
}
