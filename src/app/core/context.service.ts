import { Injectable } from '@angular/core';
import { Context } from './context';
import { ContextType } from './contextType';
import { BehaviorSubject } from 'rxjs';
import { Album } from './album';
import { Router } from '@angular/router';
import { Tag } from './tag';
import { MediaFilter } from './media.service';

@Injectable({
	providedIn: 'root'
})
export class ContextService {
	public contextChanged: BehaviorSubject<Context> = new BehaviorSubject(this.context);

	private _context: Context;
	public get context(): Context { return this._context; }
	public set context(newContext: Context) {
		this._context = newContext;
		this.contextChanged.next(this._context);
	}

	constructor(private router: Router) {
	}

	public setContextAlbum(album: Album): void {
		this.createSimpleContext(album, ContextType.ALBUM);
	}

	public setContextTag(tag: Tag): void {
		this.createSimpleContext(tag, ContextType.TAG);
	}

	public setContextSearch(filter: MediaFilter): void {
		this.createSimpleContext(filter, ContextType.SEARCH);
	}

	private createSimpleContext(dataObject: any, type: ContextType): void {
		let newContext: Context = {
			dataObject: dataObject,
			type: type
		};

		this.context = newContext;
	}

	public resetContext(): void {
		this.context = null;
	}
}
