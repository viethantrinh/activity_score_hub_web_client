import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> {
        const token = this.authService.getToken();

        if (!token) {
            this.router.navigate(['/auth']);
            return new Observable(observer => {
                observer.next(false);
                observer.complete();
            });
        }

        return this.authService.introspectToken().pipe(
            map(valid => {
                if (!valid) {
                    this.router.navigate(['/auth']);
                    return false;
                }
                return true;
            })
        );
    }
}
