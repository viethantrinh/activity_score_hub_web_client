import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', component: DashboardHomeComponent },
            { path: 'users', component: UserManagementComponent }
        ]
    },
    { path: '**', redirectTo: '/auth' }
];
