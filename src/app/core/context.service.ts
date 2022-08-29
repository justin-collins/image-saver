import { Injectable } from '@angular/core';
import { Context } from './context';
import { ContextType } from './contextType';
import { BehaviorSubject } from 'rxjs';
import { Album } from './album';
import { Tag } from './tag';
import { MediaFilter } from './mediaFilter';
import { SettingsService } from './settings.service';

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

	constructor(private settingsService: SettingsService) {
		this.createInitialContext();
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

	private createInitialContext(): void {
		let initialFilter = this.emptyFilter();
		this.createSimpleContext(initialFilter, ContextType.SEARCH);
	}

	private createSimpleContext(dataObject: any, type: ContextType): void {
		let newContext: Context = {
			dataObject: dataObject,
			type: type
		};

		this.context = newContext;
	}

	public resetContext(): void {
		let emptyFilter: MediaFilter = this.emptyFilter();
		this.createSimpleContext(emptyFilter, ContextType.SEARCH);
	}

	private emptyFilter(): MediaFilter {
		return {
			term: '',
			type: null,
			location: null,
			sortBy: this.settingsService.settings.default_media_sort
		};
	}
}
