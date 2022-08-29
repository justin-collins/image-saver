import * as fs from 'fs';
import * as path from 'path';

import { Injectable } from '@angular/core';
import { Database } from '@journeyapps/sqlcipher';
import { Observable, merge } from 'rxjs';
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

	public static initialize(passKey: string): Observable<any> {
		DatabaseService.initPaths();

		const schema = fs.readFileSync(DatabaseService.schemaPath, { encoding: 'utf8' });
		return DatabaseService.createDb(DatabaseService.dbPath).pipe(
			flatMap((newDB) => {
				DatabaseService.db = newDB;
				DatabaseService.db.run(`PRAGMA cipher_compatibility = 3`);
				DatabaseService.db.run(`PRAGMA key = ${passKey}`);
				DatabaseService.db.run(`PRAGMA foreign_keys = true`);
				return DatabaseService.exec(schema);
			})
		)
	}

	private static initPaths(): void {
		const appPath = '';
		DatabaseService.dbFolder = path.join(appPath, 'database');
		DatabaseService.dbPath = path.join(DatabaseService.dbFolder, 'database.db');
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

	private static exec(sql: string): Observable<void> {
		return Observable.create((observer) => {
			DatabaseService.db.exec(sql, (err) => {
				if (err) {
					observer.error(err);
				} else {
					observer.next();
					observer.complete();
				}
			});
		});
	}

	private static change(sql: string, values: {}): Observable<dbResult> {
		return Observable.create((observer) => {
			DatabaseService.db.run(sql, values, function (err) {
				if (err) {
					observer.error(err);
				} else {
					observer.next({ changes: this.changes, lastID: this.lastID });
					observer.complete();
				}
			});
		});
	}

	public static selectOne(sql: string, values: {}): Observable<{}> {
		return Observable.create((observer) => {
			DatabaseService.db.get(sql, values, (err, row) => {
				if (err) {
					observer.error(err);
				} else {
					observer.next(row);
					observer.complete();
				}
			});
		});
	}

	public static runFile(fileName: string): Observable<void> {
		let filePath: string = path.join(DatabaseService.dbFolder, fileName);
		let sql: string = fs.readFileSync(filePath, { encoding: 'utf8' });
		return DatabaseService.exec(sql);
	}

	public static selectAll(sql: string, values: {}): Observable<Array<{}>> {
		return Observable.create((observer) => {
			DatabaseService.db.all(sql, values, (err, rows) => {
				if (err) {
					observer.error(err);
				} else {
					observer.next(rows);
					observer.complete();
				}
			});
		});
	}

	public static insert(sql: string, values: {}): Observable<dbResult> {
		return DatabaseService.change(sql, values);
	}

	public static update(sql: string, values: {}): Observable<dbResult> {
		return DatabaseService.change(sql, values);
	}

	public static delete(sql: string, values: {}): Observable<dbResult> {
		return DatabaseService.change(sql, values);
	}

	public static dbExists(): boolean {
		DatabaseService.initPaths();

		return fs.existsSync(DatabaseService.dbPath);
	}

	public static changePassword(oldPass: string, newPass: string): Observable<boolean> {
		let curKey: Observable<boolean> = Observable.create((observer) => {
			DatabaseService.db.run(`PRAGMA key = ${oldPass}`, (err) => {
				if (err) {
					observer.error(err);
				} else {
					observer.next();
					observer.complete();
				}
			});
		});

		let newKey: Observable<boolean> = Observable.create((observer) => {
			DatabaseService.db.run(`PRAGMA rekey = ${newPass}`, (err) => {
				if (err) {
					observer.error(err);
				} else {
					observer.next();
					observer.complete();
				}
			});
		});

		return merge(curKey, newKey);
	}
}

export interface dbResult {
    changes: number;
    lastID: number;
}
