import { Component, OnInit, NgZone } from '@angular/core';
import { SettingsService } from '../core/settings.service';
import { Settings } from '../core/settings';
import { MessagingService } from '../core/messaging.service';
import { FormBuilder, Validators, FormGroup, FormControl, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { DatabaseService } from '../core/database.service';

class ConfirmErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: NgForm | null): boolean {
		const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
		const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

		return (invalidCtrl || invalidParent);
	}
}

@Component({
	selector: 'isvr-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
	public settings: Settings;

	public newPassForm: FormGroup = new FormGroup({});
	public formErrorMatcher = new ConfirmErrorStateMatcher();

	constructor(private settingsService: SettingsService,
				private messagingService: MessagingService,
				private fb: FormBuilder,
				private _ngZone: NgZone) { }

	ngOnInit() {
		this.resetSettings();

		this.newPassForm = this.fb.group({
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
