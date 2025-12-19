// angular core
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  FormGroupDirective,
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

// modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

// components
import { SpinnerComponent } from '@components/spinner/spinner.component';
import { MatSnackBar } from '@angular/material/snack-bar';

// models
import { 
  Workspace, 
  WorkspaceListResponse, 
  CreateWorkspaceRequest, 
  CreateWorkspaceResponse 
} from '@models/workspace.model';
import { 
  SendMessageRequest, 
  SendMessageResponse 
} from '@models/message.model';

// services
import { WorkspaceService } from '@services/workspace.service';
import { MessageService } from '@services/message.service';

@Component({
  selector: 'app-task2',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    SpinnerComponent
  ],
  templateUrl: './task2.component.html',
  styleUrl: './task2.component.scss'
})
export class Task2Component {

  loading: boolean = false;
  workspaces: Workspace[] = [];
  selectedWorkspaceId: string | null = null;
  actionStatus: string | null = null;
  workspaceForm: FormGroup;
  messageForm: FormGroup;

  get isCreatingWorkspace(): boolean {
    return this.actionStatus == 'workspace';
  }

  get isSendingMessage(): boolean {
    return this.actionStatus == 'message';
  }

  constructor(
    private snackBar: MatSnackBar,
    private workspaceService: WorkspaceService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.workspaceForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      type: 'public'
    });

    this.messageForm = this.fb.group({
      content: ['', Validators.required],
      type: 'text'
    });
  }

  ngOnInit() {
    this.loadWorkspaces();
  }
  
  // sleep by miliseconds to simulate loading time
  sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // load all workspaces, choose first one by default and load its messages
  async loadWorkspaces(): Promise<void> {
    this.loading = true;
    await this.sleep(2000);
    this.workspaceService.getAllWorkspaces()
      .subscribe({
        next: (res: WorkspaceListResponse) => {
          this.loading = false;
          if (res.data.length > 0) {
            this.workspaces = res.data;
            this.selectedWorkspaceId = this.workspaces[0]._id;
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

  // Set current action status
  setActionStatus(status: string): void {
    if (status == "message" && this.workspaces.length == 0) {
      this.snackBar.open(
        `Please create workspace first!`,
        'Close',
        {
          duration: 3000,           
          horizontalPosition: 'right',
          verticalPosition: 'top'
        }
      );
      return;
    }
    this.actionStatus = status;
  }

  // Create new workspace
  async createWorkspace(workspaceFormDir: FormGroupDirective): Promise<void> {
    if (this.workspaceForm.invalid) {
      this.snackBar.open(
        'Please fix validation errors before submit.', 
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        }
      );
      return;
    }

    this.loading = true;    
    await this.sleep(2000);
    const request = this.workspaceForm.value as CreateWorkspaceRequest;
    this.workspaceService.createWorkspace(request).subscribe({
      next: (res: CreateWorkspaceResponse) => {
        this.loading = false;
        if (res.success) {
          this.workspaces.push(res.data);
          this.selectedWorkspaceId = res.data._id;
          this.snackBar.open(
            `Created workspace successfully.`,
            'Close',
            {
              duration: 3000,           
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['snack-success']
            }
          );
          this.resetForm(this.workspaceForm, workspaceFormDir);
        } else {
          this.snackBar.open(
            "Failed to create workspace", 
            'Close', 
            {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top'
            }
          );
        }
      },
      error: (err: Error) => {
        this.loading = false;
        this.snackBar.open(
          "Failed to create workspace", 
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
  
  // Send a message to selected workspace
  async sendMessage(messageFormDir: FormGroupDirective): Promise<void> {
    if (this.messageForm.invalid) {
      this.snackBar.open(
        'Please fix validation errors before submit.', 
        'Close',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        }
      );
      return;
    }

    this.loading = true;
    await this.sleep(2000);
    const request: SendMessageRequest = this.messageForm.value;
    this.messageService.sendMessage(this.selectedWorkspaceId!, request).subscribe({
      next: (res: SendMessageResponse) => {
        this.loading = false;
        if (res.success) {
          this.snackBar.open(
            `Sent message successfully.`,
            'Close',
            {
              duration: 3000,           
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['snack-success']
            }
          );
          this.resetForm(this.messageForm, messageFormDir);
        } else {
          this.snackBar.open(
            `Failed to send message.`,
            'Close',
            {
              duration: 3000,           
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['snack-success']
            }
          );
        }        
      },
      error: (err: Error) => {
        this.loading = false;
        this.snackBar.open(
          `Failed to send message.`,
          'Close',
          {
            duration: 3000,           
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['snack-success']
          }
        );
      }
    });
  }

  // reset form contents
  resetForm(formGroup: FormGroup, formDir: FormGroupDirective): void {
    switch (formGroup) {
      case this.workspaceForm:
        this.workspaceForm.reset({ name: '', description: '', type: 'public' });
        break;
      case this.messageForm:
        this.messageForm.reset({ content: '', type: 'text' });
        break;
    }
    formDir.resetForm();
  }

  // validation helper to check if control has validation error
  hasError(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    if (!control) return false;
    
    return control.invalid;
  }
}
