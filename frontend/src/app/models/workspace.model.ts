export interface Workspace {
    _id: string;
    name: string;
    description?: string;
    type: 'public' | 'private';
    createdBy?: string;
    members?: Array<{
        userId: string;
        role: 'owner' | 'admin' | 'member';
        joinedAt: Date;
    }>;
    createdAt: string;
    updatedAt: string;
    messageCount?: number;
}

export interface CreateWorkspaceRequest {
    name: string;
    description?: string;
    type?: 'public' | 'private';
    createdBy?: string;
}

export interface WorkspaceListResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    data: Workspace[];
}