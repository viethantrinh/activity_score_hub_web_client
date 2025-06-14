import { Routes } from '@angular/router';
import { ActivityManagementComponent } from './components/activity-management/activity-management.component';
import { AuthComponent } from './components/auth/auth.component';
import { DashboardHomeComponent } from './components/dashboard-home/dashboard-home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AdminGuard } from './guards/admin.guard';
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
            { path: 'users', component: UserManagementComponent, canActivate: [AdminGuard] },
            { path: 'activities', component: ActivityManagementComponent, canActivate: [AdminGuard] },
            { path: 'roles', component: RoleManagementComponent, canActivate: [AdminGuard] }
        ]
    },
    { path: '**', redirectTo: '/auth' }
];
