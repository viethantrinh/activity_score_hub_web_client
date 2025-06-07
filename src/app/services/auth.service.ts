import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
    ApiResponse,
    AuthResponse,
    IntrospectResponse,
    IntrospectTokenRequest,
    SignInRequest,
    SignOutRequest,
    SignUpRequest,
    User
} from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl = 'http://localhost:8080/auth';
    private tokenKey = 'auth_token';
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) {
        this.checkStoredToken();
    }

    signIn(request: SignInRequest): Observable<AuthResponse> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/sign-in`, request)
            .pipe(
                map(response => response.result),
                tap(result => {
                    this.storeToken(result.token);
                    this.loadCurrentUser();
                })
            );
    }

    signUp(request: SignUpRequest): Observable<AuthResponse> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.baseUrl}/sign-up`, request)
            .pipe(
                map(response => response.result),
                tap(result => {
                    this.storeToken(result.token);
                    this.loadCurrentUser();
                })
            );
    }

    signOut(): Observable<any> {
        const token = this.getToken();
        if (!token) {
            this.clearToken();
            return of(null);
        }

        const request: SignOutRequest = { token };
        return this.http.post<ApiResponse<any>>(`${this.baseUrl}/sign-out`, request)
            .pipe(
                tap(() => {
                    this.clearToken();
                }),
                catchError(() => {
                    this.clearToken();
                    return of(null);
                })
            );
    }

    introspectToken(token?: string): Observable<boolean> {
        const tokenToCheck = token || this.getToken();
        if (!tokenToCheck) {
            return of(false);
        }

        const request: IntrospectTokenRequest = { token: tokenToCheck };
        return this.http.post<ApiResponse<IntrospectResponse>>(`${this.baseUrl}/introspect-token`, request)
            .pipe(
                map(response => response.result.valid),
                tap(valid => {
                    if (!valid) {
                        this.clearToken();
                    }
                }),
                catchError(() => {
                    this.clearToken();
                    return of(false);
                })
            );
    }

    private storeToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    private clearToken(): void {
        localStorage.removeItem(this.tokenKey);
        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    private checkStoredToken(): void {
        const token = this.getToken();
        if (token) {
            this.introspectToken(token).subscribe(valid => {
                if (valid) {
                    this.loadCurrentUser();
                }
            });
        }
    }

    getAuthHeaders(): HttpHeaders {
        const token = this.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        });
    }

    getCurrentUser(): Observable<User> {
        return this.http.get<ApiResponse<User>>(`${this.baseUrl}/profile`, {
            headers: this.getAuthHeaders()
        }).pipe(
            map(response => response.result),
            tap(user => {
                this.currentUserSubject.next(user);
            }),
            catchError(error => {
                console.error('Error getting current user:', error);
                this.clearToken();
                return of(null as any);
            })
        );
    }

    hasRole(role: string): Observable<boolean> {
        if (this.currentUserSubject.value) {
            return of(this.currentUserSubject.value.systemRoles.includes(role));
        }

        return this.getCurrentUser().pipe(
            map(user => user?.systemRoles?.includes(role) || false),
            catchError(() => of(false))
        );
    }

    isAdmin(): Observable<boolean> {
        return this.hasRole('ADMIN');
    }

    private loadCurrentUser(): void {
        if (this.getToken()) {
            this.getCurrentUser().subscribe();
        }
    }
}
