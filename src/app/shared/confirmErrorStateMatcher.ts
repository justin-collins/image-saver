import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, NgForm } from '@angular/forms';

export class ConfirmErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: NgForm | null): boolean {
		const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
		const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

		return (invalidCtrl || invalidParent);
	}
}
