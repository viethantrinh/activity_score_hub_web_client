import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Activity, ActivityListItem, CreateActivityRequest, UpdateActivityRequest } from '../models/activity.model';
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
export class ActivityService {
    private apiUrl = `${environment.apiUrl}/activities`;

    constructor(private http: HttpClient, private authService: AuthService) { }    /**
     * Tạo hoạt động mới
     */
    createActivity(request: CreateActivityRequest): Observable<ApiResponse<Activity>> {
        return this.http.post<ApiResponse<Activity>>(this.apiUrl, request, {
            headers: this.authService.getAuthHeaders()
        });
    }

    /**
     * Cập nhật hoạt động
     */
    updateActivity(id: number, request: UpdateActivityRequest): Observable<ApiResponse<Activity>> {
        return this.http.put<ApiResponse<Activity>>(`${this.apiUrl}/${id}`, request, {
            headers: this.authService.getAuthHeaders()
        });
    }

    /**
     * Xóa hoạt động
     */
    deleteActivity(id: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`, {
            headers: this.authService.getAuthHeaders()
        });
    }

    /**
     * Lấy chi tiết hoạt động
     */
    getActivityById(id: number): Observable<ApiResponse<Activity>> {
        return this.http.get<ApiResponse<Activity>>(`${this.apiUrl}/${id}`, {
            headers: this.authService.getAuthHeaders()
        });
    }

    /**
     * Lấy danh sách hoạt động
     */
    getAllActivities(): Observable<ApiResponse<ActivityListItem[]>> {
        return this.http.get<ApiResponse<ActivityListItem[]>>(this.apiUrl, {
            headers: this.authService.getAuthHeaders()
        });
    }
}
