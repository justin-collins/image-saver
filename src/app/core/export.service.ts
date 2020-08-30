import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ExportOptions {
	includeLocalFiles: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class ExportService {

	constructor() { }

	public export(exportPath: string, options: ExportOptions): Observable<boolean> {
		return Observable.create((observer) => {

		});
	}
}
