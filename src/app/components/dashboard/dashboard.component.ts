import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
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
    mobileMenuOpen = false;
    isMobile = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {
        this.checkScreenSize();
    }

    ngOnInit(): void {
        this.checkAuthentication();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.checkScreenSize();
    }

    private checkScreenSize(): void {
        this.isMobile = window.innerWidth <= 768;
        if (!this.isMobile) {
            this.mobileMenuOpen = false;
        }
    }

    private checkAuthentication(): void {
        this.authService.introspectToken().subscribe(valid => {
            if (!valid) {
                this.router.navigate(['/auth']);
            }
        });
    }

    toggleSidebar(): void {
        if (this.isMobile) {
            this.mobileMenuOpen = !this.mobileMenuOpen;
        } else {
            this.sidebarCollapsed = !this.sidebarCollapsed;
        }
    }

    closeMobileMenu(): void {
        this.mobileMenuOpen = false;
    }

    onNavClick(): void {
        if (this.isMobile) {
            this.closeMobileMenu();
        }
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
