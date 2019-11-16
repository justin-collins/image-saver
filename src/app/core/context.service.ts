import { Injectable } from '@angular/core';
import { Context } from './context';
import { ContextType } from './contextType';
import { BehaviorSubject } from 'rxjs';
import { Album } from './album';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class ContextService {
	public contextChanged: BehaviorSubject<Context> = new BehaviorSubject(null);

	private _context: Context;
	public get context(): Context { return this._context; }
	public set context(newContext: Context) {
		this._context = newContext;
		this.contextChanged.next(this._context);
	}

	constructor(private router: Router) {
		this.router.events.subscribe(this.navigated);
	}

	private navigated = (event): void => {
		if (event instanceof NavigationEnd) {
			this.checkResetContext(event.url);
		}
	}

	public setContextAlbum(album: Album): void {
		this.createSimpleContext(album, ContextType.ALBUM);
	}

	private createSimpleContext(dataObject: any, type: ContextType): void {
		let newContext: Context = {
			dataObject: dataObject,
			type: type
		};

		this.context = newContext;
	}

	private checkResetContext(url: string): void {
		let formattedUrl: string = url.substr(1, url.length);
		let splitUrl: string[] = formattedUrl.split('/');

		if (splitUrl.length === 1) {
			this.resetContext();
		}
	}

	private resetContext(): void {
		this.context = null;
	}
}
