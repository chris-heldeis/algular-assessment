import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workspace, CreateWorkspaceRequest, WorkspaceListResponse } from '@models/workspace.model';

@Injectable({
    providedIn: 'root'
})
export class WorkspaceService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    // get all workspaces with pagination and filtering support
    getAllWorkspaces(params?: {
        page?: number;
        limit?: number;
        type?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Observable<WorkspaceListResponse> {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key as keyof typeof params] !== undefined) {
                    httpParams = httpParams.set(key, params[key as keyof typeof params]!.toString());
                }
            });
        }
        return this.http.get<WorkspaceListResponse>(`${this.apiUrl}/workspaces`, { params: httpParams });
    }

    // get workspace by id
    getWorkspaceById(id: string): Observable<{ success: boolean; data: Workspace }> {
        return this.http.get<{ success: boolean; data: Workspace }>(`${this.apiUrl}/workspaces/${id}`);
    }

    // create new workspace
    createWorkspace(request: CreateWorkspaceRequest): Observable<{ success: boolean; data: Workspace }> {
        return this.http.post<{ success: boolean; data: Workspace }>(`${this.apiUrl}/workspaces`, request);
    }

    // update workspace by id
    updateWorkspace(id: string, request: Partial<CreateWorkspaceRequest>): Observable<{ success: boolean; data: Workspace }> {
        return this.http.put<{ success: boolean; data: Workspace }>(`${this.apiUrl}/workspaces/${id}`, request);
    }

    // delete workspace by id
    deleteWorkspace(id: string): Observable<{ success: boolean; data: {} }> {
        return this.http.delete<{ success: boolean; data: {} }>(`${this.apiUrl}/workspaces/${id}`);
    }

    // initialization
    initializeProject(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/init`);
    }
}
