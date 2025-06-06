export interface User {
    id?: number;
    username: string;
    email: string;
    workEmail: string;
    name: string;
    unit: string;
    academicRank: string;
    degree: string;
    phoneNumber: string;
    notes: string;
    systemRoles: string[];
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignUpRequest {
    username: string;
    email: string;
    workEmail: string;
    password: string;
    name: string;
    unit: string;
    academicRank: string;
    degree: string;
    phoneNumber: string;
    notes: string;
}

export interface SignOutRequest {
    token: string;
}

export interface IntrospectTokenRequest {
    token: string;
}

export interface AuthResponse {
    token: string;
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    timestamp: string;
    errorResponse: any;
    result: T;
}

export interface IntrospectResponse {
    valid: boolean;
}
