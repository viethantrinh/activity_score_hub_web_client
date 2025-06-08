import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    ActivityParticipantsRequest,
    ActivityRoleResponse,
    ApiResponse,
    UserActivityRequest,
    UserActivityResponse
} from '../models/user-activity.model';

@Injectable({
    providedIn: 'root'
})
export class UserActivityService {
    private apiUrl = `${environment.apiUrl}/user-activities`;

    constructor(private http: HttpClient) { }

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('auth_token');
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    /**
     * Lấy danh sách vai trò của hoạt động
     */
    getActivityRoles(activityId: number): Observable<ApiResponse<ActivityRoleResponse[]>> {
        return this.http.get<ApiResponse<ActivityRoleResponse[]>>(
            `${this.apiUrl}/activities/${activityId}/roles`,
            { headers: this.getHeaders() }
        );
    }

    /**
     * Lấy danh sách người tham gia hoạt động
     */
    getActivityParticipants(activityId: number): Observable<ApiResponse<UserActivityResponse[]>> {
        return this.http.get<ApiResponse<UserActivityResponse[]>>(
            `${this.apiUrl}/activities/${activityId}/participants`,
            { headers: this.getHeaders() }
        );
    }

    /**
     * Thêm người tham gia vào hoạt động
     */
    addParticipant(request: UserActivityRequest): Observable<ApiResponse<UserActivityResponse>> {
        return this.http.post<ApiResponse<UserActivityResponse>>(
            `${this.apiUrl}`,
            request,
            { headers: this.getHeaders() }
        );
    }

    /**
     * Cập nhật danh sách người tham gia hoạt động
     */
    updateActivityParticipants(
        activityId: number,
        request: ActivityParticipantsRequest
    ): Observable<ApiResponse<UserActivityResponse[]>> {
        return this.http.put<ApiResponse<UserActivityResponse[]>>(
            `${this.apiUrl}/activities/${activityId}/participants`,
            request,
            { headers: this.getHeaders() }
        );
    }

    /**
     * Xóa người tham gia khỏi hoạt động
     */
    removeParticipant(userId: number, activityId: number): Observable<ApiResponse<void>> {
        return this.http.delete<ApiResponse<void>>(
            `${this.apiUrl}/users/${userId}/activities/${activityId}`,
            { headers: this.getHeaders() }
        );
    }
}
