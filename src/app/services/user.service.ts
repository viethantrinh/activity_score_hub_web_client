import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse, User } from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = 'http://localhost:8080/users';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    getAllUsers(): Observable<User[]> {
        return this.http.get<ApiResponse<User[]>>(this.baseUrl, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            map(response => response.result)
        );
    }

    getUserById(id: number): Observable<User> {
        return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            map(response => response.result)
        );
    }

    createUser(user: Omit<User, 'id' | 'systemRoles'> & { password: string }): Observable<User> {
        return this.http.post<ApiResponse<User>>(this.baseUrl, user, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            map(response => response.result)
        );
    }

    updateUser(id: number, user: Omit<User, 'id' | 'systemRoles'>): Observable<User> {
        return this.http.put<ApiResponse<User>>(`${this.baseUrl}/${id}`, user, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            map(response => response.result)
        );
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete<ApiResponse<any>>(`${this.baseUrl}/${id}`, {
            headers: this.authService.getAuthHeaders()
        }).pipe(
            map(response => response.result)
        );
    }
}
