import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
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

export interface CreateRoleRequest {
    name: string;
    description?: string;
}

export interface UpdateRoleRequest {
    name?: string;
    description?: string;
}

@Injectable({
    providedIn: 'root'
})
export class RoleService {
    private apiUrl = `${environment.apiUrl}/roles`;

    constructor(private http: HttpClient, private authService: AuthService) { }

    /**
     * Lấy danh sách tất cả roles
     */
    getAllRoles(): Observable<ApiResponse<Role[]>> {
        return this.http.get<ApiResponse<Role[]>>(this.apiUrl, {
            headers: this.authService.getAuthHeaders()
        });
    }

    /**
     * Lấy chi tiết vai trò theo ID
     */
    getRoleById(id: number): Observable<Role> {
        return this.http.get<ApiResponse<Role>>(`${this.apiUrl}/${id}`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            map(response => response.result)
        );
    }

    /**
     * Tạo vai trò mới
     */
    createRole(request: CreateRoleRequest): Observable<Role> {
        return this.http.post<ApiResponse<Role>>(this.apiUrl, request, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            map(response => response.result)
        );
    }

    /**
     * Cập nhật vai trò
     */
    updateRole(id: number, request: UpdateRoleRequest): Observable<Role> {
        return this.http.put<ApiResponse<Role>>(`${this.apiUrl}/${id}`, request, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            map(response => response.result)
        );
    }

    /**
     * Xóa vai trò
     */
    deleteRole(id: number): Observable<any> {
        return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            map(response => response.result)
        );
    }
}
