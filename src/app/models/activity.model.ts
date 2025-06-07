export interface Activity {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    roles: ActivityRole[];
}

export interface ActivityRole {
    id: number;
    roleId: number;
    roleName: string;
    roleDescription: string;
    score: number;
}

export interface ActivityListItem {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    totalRoles: number;
}

export interface CreateActivityRequest {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    roles: {
        roleId: number;
        score: number;
    }[];
}

export interface UpdateActivityRequest {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    roles: {
        id?: number;
        roleId: number;
        score: number;
    }[];
}
