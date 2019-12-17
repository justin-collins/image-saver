import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'initialCase'
})
export class InitialCasePipe implements PipeTransform {

	transform(text: any): string {
		return typeof text === 'string' ? this.ucFirst(text) : text;
	}

	private ucFirst(text: string) {
		return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
	}
}
