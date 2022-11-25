import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ISVRAnimations } from '../animations';

@Component({
	selector: 'isvr-drawer-toggle-btn',
	templateUrl: './drawer-toggle-btn.component.html',
	styleUrls: ['./drawer-toggle-btn.component.scss'],
	animations: [ISVRAnimations.drawerOpenStart, ISVRAnimations.drawerOpenEnd]
})
export class DrawerToggleBtnComponent {

	@Input() position: 'start' | 'end' = 'start';
	@Output() onToggle = new EventEmitter<boolean>();

	public drawerIsOpen: boolean = false;

	//allows control from outside the component
	private _isOpen: boolean;
	public get isOpen(): boolean { return this._isOpen; }
	@Input() set isOpen(newIsOpen: boolean) {
		this._isOpen = newIsOpen;
		this.drawerIsOpen = newIsOpen;
	}

	constructor() { }

	public toggleDrawer(): void {
		this.drawerIsOpen = !this.drawerIsOpen;
		this.onToggle.emit(this.drawerIsOpen);
	}

	public shouldAnimateStart(): boolean {
		if (this.position !== 'start') return;
		return this.drawerIsOpen;
	}

	public shouldAnimateEnd(): boolean {
		if (this.position !== 'end') return;
		return this.drawerIsOpen;
	}
}