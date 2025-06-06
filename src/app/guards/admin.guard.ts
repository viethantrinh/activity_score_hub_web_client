import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router
    ) { }

    canActivate(): Observable<boolean> {
        // For now, we'll allow all authenticated users to access admin features
        // In the future, you can implement proper role checking here
        // by getting current user info and checking if they have ADMIN role

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
                // TODO: Check user role here
                // For now, allow all authenticated users
                return true;
            })
        );
    }
}
