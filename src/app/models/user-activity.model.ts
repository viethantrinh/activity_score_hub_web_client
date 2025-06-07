import { Role } from './role.model';
import { User } from './user.model';

export interface UserActivityRequest {
    userId: number;
    activityId: number;
    roleId: number;
    notes?: string;
}

export interface UserActivityResponse {
    id: number;
    user: User;
    role: Role;
    score: number;
    notes?: string;
}

export interface ActivityRoleResponse {
    id: number;
    role: Role;
    score: number;
}

export interface UserRoleAssignment {
    userId: number;
    roleId: number;
    notes?: string;
}

export interface ActivityParticipantsRequest {
    activityId: number;
    assignments: UserRoleAssignment[];
}

export interface ApiResponse<T> {
    code: number;
    message: string;
    timestamp: string;
    result?: T;
}
