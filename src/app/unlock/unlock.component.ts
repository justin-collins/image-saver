import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { StartupService } from '../core/startup.service';
import { Router } from '@angular/router';
import { MessagingService } from '../core/messaging.service';
import { SettingsService } from '../core/settings.service';
import { DatabaseService } from '../core/database.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfirmErrorStateMatcher } from '../shared/confirmErrorStateMatcher';
@Component({
	selector: 'isvr-unlock',
	templateUrl: './unlock.component.html',
	styleUrls: ['./unlock.component.scss']
})
export class UnlockComponent implements OnInit {
	public passKey: string;
	public error: boolean = false;
	public dbExists: boolean;

	@ViewChild('passKeyInput') passKeyInput: ElementRef;
	public newPassForm: FormGroup = new FormGroup({});
	public formErrorMatcher = new ConfirmErrorStateMatcher();

	constructor(private startupService: StartupService,
				private settingsService: SettingsService,
				private messagingService: MessagingService,
				private formBuilder: FormBuilder,
				private _ngZone: NgZone,
				private router: Router) { }

	ngOnInit(): void {
		this.dbExists = DatabaseService.dbExists();

		if (!this.dbExists) {
			this.setupPasswordForm();
		} else {
			this.focusInput();
		}
	}

	private focusInput(): void {
		this._ngZone.run(() => {
			setTimeout(_ => this.passKeyInput.nativeElement.focus(), 10);
		});
	}

	private setupPasswordForm(): void {
		this.newPassForm = this.formBuilder.group({
			password: ['', [Validators.required]],
			confirmPass: ['', [Validators.required]]
		}, {validator: this.checkPasswords})
	}

	public unlock(): void {
		let passKey: string = (this.dbExists) ? this.passKey : this.newPassForm.controls['password'].value;
		let escapedPassKey: string = escape(passKey);
		this.startupService.startupDatabase(escapedPassKey).subscribe(this.unlocked, this.unlockError);
	}

	private unlocked = (): void => {
		this.startupService.unlocked = true;
		this.messagingService.message('Unlocked!');


		this.startupService.initialize().subscribe(() => {
			this._ngZone.run(() => {
				let landingPage: string = this.settingsService.settings.landing_page;
				this.router.navigate(['/', landingPage]);
			});
		});
	}

	private unlockError = (): void => {
		this._ngZone.run(() => {
			this.error = true;
		});
	}

	private checkPasswords(group: FormGroup) {
		let pass = group.get('password').value;
		let confirmPass = group.get('confirmPass').value;

		return pass === confirmPass ? null : { notSame: true }
	}
}
