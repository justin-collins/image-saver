import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class MessagingService {

	constructor(public snackBar: MatSnackBar) { }

	public message(copy: string): void {
		this.snackBar.open(copy, 'Dismiss', { duration: 3000 });
	}

	public error(error: any, copy?: string): void {
		copy = copy || 'Error';
		this.snackBar.open(copy, 'Dismiss', { duration: 6000 });
		console.error(error);
	}
}
