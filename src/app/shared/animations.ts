import { trigger, state, style, transition, animate } from '@angular/animations';

export class ISVRAnimations {
	static ngIfSlide = trigger('ngIfSlide', [
		state('void', style({ opacity: 0, transform: 'translateX(10%)' })),
		state('*', style({ opacity: 1, transform: 'translateX(0)' })),
		transition('void => *, * => void', animate('350ms ease-in-out'))
	]);
	//duplicates the default material drawer animation with right position
	static drawerOpen = trigger('drawerOpen', [
		state('true', style({ right: '300px' })),
		state('false', style({ right: '0' })),
		transition('false <=> true',
			animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
	]);
}
