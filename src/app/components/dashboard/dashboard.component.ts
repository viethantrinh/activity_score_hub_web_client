import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    sidebarCollapsed = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.checkAuthentication();
    }

    private checkAuthentication(): void {
        this.authService.introspectToken().subscribe(valid => {
            if (!valid) {
                this.router.navigate(['/auth']);
            }
        });
    }

    toggleSidebar(): void {
        this.sidebarCollapsed = !this.sidebarCollapsed;
    }

    isAdmin(): Observable<boolean> {
        return this.authService.hasRole('ADMIN');
    }

    logout(): void {
        this.authService.signOut().subscribe(() => {
            this.router.navigate(['/auth']);
        });
    }
}
