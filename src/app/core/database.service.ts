import * as fs from 'fs';
import * as path from 'path';

import { remote } from 'electron';
import { Injectable } from '@angular/core';
import { Database } from 'sqlite3';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class DatabaseService {
	private static db: Database;
	private static dbFolder: string;
	private static dbPath: string;
	private static schemaPath: string;

	constructor() { }

	public static initialize(): void {
		DatabaseService.initPaths();
		console.log(DatabaseService.dbPath);
	}
	// 	const schema = fs.readFileSync(DatabaseService.schemaPath, { encoding: 'utf8' });
	// 	DatabaseService.createDb(DatabaseService.dbPath).pipe(
	// 		flatMap((newDB) => {
	// 			DatabaseService.db = newDB;
	// 			return DatabaseService.exec(schema);
	// 		})
	// 	).subscribe();
	// }

	private static initPaths(): void {
		const rootPath = remote.app.getAppPath();
		const appPath = rootPath.slice(0, rootPath.indexOf('node_modules'));
		DatabaseService.dbFolder = path.join(appPath, 'database');
		DatabaseService.dbPath = path.join(DatabaseService.dbFolder, 'database.sql');
		DatabaseService.schemaPath = path.join(DatabaseService.dbFolder, 'database.schema.sql');
	}

	public static createDb(dbPath: string): Observable<any> {
		return Observable.create((observer) => {
			const db = new Database(dbPath, (err) => {
				if (err) {
					observer.error(err);
				} else {
					observer.next(db);
					observer.complete();
				}
			});
		});
	}

	// private static exec(sql: string): Observable<void> {
	// 	return Observable.create((observer) => {
	// 		DatabaseService.db.exec(sql, (err) => {
	// 			if (err) {
	// 				observer.error(err);
	// 			} else {
	// 				observer.next();
	// 				observer.complete();
	// 			}
	// 		});
	// 	});
	// }

}
