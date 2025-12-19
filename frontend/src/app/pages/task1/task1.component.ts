// angular core
import { Component, OnInit, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

// modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

// components
import { SpinnerComponent } from '@components/spinner/spinner.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

// models
import { Message, MessageListResponse } from '@models/message.model';
import { Workspace, WorkspaceListResponse } from '@models/workspace.model';

// services
import { MessageService } from '@services/message.service';
import { WorkspaceService } from '@services/workspace.service';

@Component({
  selector: 'app-task1',
  standalone: true,
  imports: [
    CommonModule, 
    MatSnackBarModule, 
    MatFormFieldModule, 
    MatSelectModule, 
    MatTableModule, 
    MatPaginatorModule,
    SpinnerComponent
  ],
  templateUrl: './task1.component.html',
  styleUrl: './task1.component.scss'
})
export class Task1Component implements OnInit {

  workspaces: Workspace[] = [];
  messages: Message[] = [];
  selectedWorkspaceId: string | null = null;
  loading: boolean = false;
  error: string | null = null;
  totalMsgCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 2;
  pageSizeOptions: number[] = [2, 5, 10, 25, 100];
  hasMore: boolean = true;
  displayedColumns: string[] = ['content', 'author', 'createdAt', 'type'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  get hasWorkspace(): boolean {
    return this.workspaces.length > 0;
  }

  get hasMessages(): boolean {
    return this.totalMsgCount > 0;
  }

  constructor(
    private snackBar: MatSnackBar,
    private workspaceService: WorkspaceService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadWorkspaces();
  }

  // sleep by miliseconds to simulate loading time
  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // load all workspaces, choose first one by default and load its messages
  async loadWorkspaces() {
    this.loading = true;
    await this.sleep(2000);
    this.workspaceService.getAllWorkspaces()
      .subscribe({
        next: (res: WorkspaceListResponse) => {
          this.loading = false;
          if (res.data.length > 0) {
            this.workspaces = res.data;
            this.selectedWorkspaceId = this.workspaces[0]._id;
            this.loadMessages();
          } else {
            this.snackBar.open(
              'No workspace found.', 
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top'
              }
            );   
          }
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          console.log("Workspace fetching error: " + err.message);
          this.snackBar.open(
            'Error happened while fetching workspaces.', 
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            }
          );          
        }
      });
  }

  // load messages of selected workspace
  async loadMessages() {
    this.loading = true;
    await this.sleep(2000);
    this.messageService.getWorkspaceMessages(this.selectedWorkspaceId!, { page: this.currentPage, limit: this.pageSize })
      .subscribe({
        next: (res: MessageListResponse) => {
          this.loading = false;
          this.messages = res.data;
          this.totalMsgCount = res.total;
          if (this.totalMsgCount == 0) {
            this.snackBar.open(
              'No message found for this workspace.', 
              'Close',
              {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top'
              }
            ); 
          }
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          console.log("Message fetching error: " + err.message);
          this.snackBar.open(
            'Error happened while fetching messages.', 
            'Close',
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            }
          );          
        }
      }); 
  }

  // paginator change event handler
  handlePageEvent(event: PageEvent) {
    this.currentPage = this.pageSize != event.pageSize ? 1 : (event.pageIndex + 1);
    this.pageSize = event.pageSize;
    this.loadMessages();
  }
}
