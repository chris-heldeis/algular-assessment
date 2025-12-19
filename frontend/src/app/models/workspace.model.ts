// workspace model representing db record
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

// request model to create workspace
export interface CreateWorkspaceRequest {
    name: string;
    description?: string;
    type?: 'public' | 'private';
    createdBy?: string;
}

// response model of creating workspace
export interface CreateWorkspaceResponse {
    success: boolean;
    data: Workspace;
}

// response model to get workspace list
export interface WorkspaceListResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    data: Workspace[];
}