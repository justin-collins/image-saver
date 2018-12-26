import { trigger, state, style, transition, animate } from '@angular/animations';

export class ISVRAnimations {
	static ngIfSlide = trigger('ngIfSlide', [
		state('void', style({ opacity: 0, transform: 'translateX(10%)' })),
		state('*', style({ opacity: 1, transform: 'translateX(0)' })),
		transition('void => *, * => void', animate('350ms ease-in-out'))
	]);
}
