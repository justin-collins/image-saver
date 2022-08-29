import { Component, OnInit, NgZone } from '@angular/core';
import { SettingsService } from '../core/settings.service';
import { Settings } from '../core/settings';
import { MessagingService } from '../core/messaging.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DatabaseService } from '../core/database.service';
import { ConfirmErrorStateMatcher } from '../shared/confirmErrorStateMatcher';
import { MediaSortBy } from '../core/mediaSortBy';

@Component({
	selector: 'isvr-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
	public settings: Settings;
	public mediaSortBy: MediaSortBy[] = Object.keys(MediaSortBy).map(sort => MediaSortBy[sort]);

	public newPassForm: FormGroup = new FormGroup({});
	public formErrorMatcher = new ConfirmErrorStateMatcher();

	constructor(private settingsService: SettingsService,
				private messagingService: MessagingService,
				private formBuilder: FormBuilder,
				private _ngZone: NgZone) { }

	ngOnInit() {
		this.resetSettings();
		this.setupPasswordForm();
		console.log(this.settings)
	}

	private setupPasswordForm(): void {
		this.newPassForm = this.formBuilder.group({
			oldPass: ['', [Validators.required]],
			password: ['', [Validators.required]],
			confirmPass: ['', [Validators.required]]
		}, {validator: this.checkPasswords})
	}

	public translateKeyBinding(settingProp: string, e: KeyboardEvent): void {
		let keyValue: string = e.key;
		if (keyValue === ' ') keyValue = 'Space';
		this.settings[settingProp] = keyValue;
	}

	public resetSettings(): void {
		this._ngZone.run(() => {
			this.settings = new Settings(this.settingsService.settings);
		});
	}

	public saveSettings(): void {
		this.settingsService.updateAll(this.settings).subscribe(this.settingsSaved);
	}

	private settingsSaved = (response: Settings): void => {
		this.messagingService.message('Settings Saved!');
		this.resetSettings();
	}

	public resetPasswords(): void {
		this.newPassForm.controls['oldPass'].setValue('');
		this.newPassForm.controls['password'].setValue('');
		this.newPassForm.controls['confirmPass'].setValue('');
	}

	public changePassword(): void {
		let oldPass: string = this.newPassForm.controls['oldPass'].value;
		let newPass: string = this.newPassForm.controls['password'].value;

		DatabaseService.changePassword(oldPass, newPass).subscribe(this.passwordChanged);
	}

	private passwordChanged = (): void => {
		this._ngZone.run(() => {
			this.messagingService.message('Password Changed!');
			this.resetPasswords();
		});
	}

	private checkPasswords(group: FormGroup) {
		let pass = group.get('password').value;
		let confirmPass = group.get('confirmPass').value;

		return pass === confirmPass ? null : { notSame: true }
	}
}
