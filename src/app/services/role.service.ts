import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/role.model';
import { AuthService } from './auth.service';

export interface ApiResponse<T> {
    code: number;
    message: string;
    timestamp: string;
    result: T;
    errorResponse?: {
        apiPath: string;
        errors: string[];
    };
}

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private apiUrl = 'http://localhost:8080/roles';

    constructor(private http: HttpClient, private authService: AuthService) { }

    /**
     * Lấy danh sách tất cả roles
     */
    getAllRoles(): Observable<ApiResponse<Role[]>> {
        return this.http.get<ApiResponse<Role[]>>(this.apiUrl, {
            headers: this.authService.getAuthHeaders()
        });
    }
}
