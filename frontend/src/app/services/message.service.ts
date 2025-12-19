import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, SendMessageRequest, MessageListResponse} from '@models/message.model';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    // get messages by workspace id
    getWorkspaceMessages(workspaceId: string, params?: {
        page?: number;
        limit?: number;
        before?: string;
        after?: string;
    }): Observable<MessageListResponse> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key as keyof typeof params] !== undefined) {
                    httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
                }
            });
        }
        return this.http.get<MessageListResponse>(`${this.apiUrl}/workspaces/${workspaceId}/messages`, { params: httpParams });
    }

    // create new message by workspace id
    sendMessage(workspaceId: string, request: SendMessageRequest): Observable<{ success: boolean; data: Message }> {
        return this.http.post<{ success: boolean; data: Message }>(`${this.apiUrl}/workspaces/${workspaceId}/messages`, request);
    }

    // update message content by id
    updateMessage(id: string, content: string): Observable<{ success: boolean; data: Message }> {
        return this.http.put<{ success: boolean; data: Message }>(`${this.apiUrl}/messages/${id}`, { content });
    }

    // delete message by id
    deleteMessage(id: string): Observable<{ success: boolean; data: {} }> {
        return this.http.delete<{ success: boolean; data: {} }>(`${this.apiUrl}/messages/${id}`);
    }
}
