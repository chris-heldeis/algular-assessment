// message model representing db record
export interface Message {
    _id: string;
    workspaceId: string;
    content: string;
    author: {
        name: string;
        userId?: string;
        avatar?: string;
    };
    type: 'text' | 'file' | 'system';
    metadata?: {
        fileName?: string;
        fileSize?: number;
        fileType?: string;
        fileUrl?: string;
    };
    editedAt?: string;
    isEdited?: boolean;
    reactions?: Array<{
        emoji: string;
        userId: string;
        createdAt: Date;
    }>;
    createdAt: string;
    updatedAt: string;
}

// request model to send message
export interface SendMessageRequest {
    content: string;
    author: {
        name: string;
        userId?: string;
        avatar?: string;
    };
    type?: 'text' | 'file' | 'system';
    metadata?: {
        fileName?: string;
        fileSize?: number;
        fileType?: string;
        fileUrl?: string;
    };
}

// response model of sending message
export interface SendMessageResponse {
    success: boolean;
    data: Message;
}

// response model to get message list
export interface MessageListResponse {
    success: boolean;
    count: number;
    total: number;
    page: number;
    pages: number;
    data: Message[];
}