import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ImportService {

	constructor() { }

	public import(importPath: string): Observable<boolean> {
		return Observable.create((observer) => {

		});
	}
}
