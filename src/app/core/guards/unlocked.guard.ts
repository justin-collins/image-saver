import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StartupService } from '../services/startup.service';

@Injectable({
	providedIn: 'root'
})
export class UnlockedGuard implements CanActivate {
	constructor(private startupService: StartupService,
				private router: Router){}

	canActivate(next: ActivatedRouteSnapshot,
				state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (this.startupService.unlocked) {
			return true;
		} else {
			this.router.navigate(['/unlock']);
			return false;
		}
	}

}
