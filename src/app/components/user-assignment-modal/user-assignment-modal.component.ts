import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Activity } from '../../models/activity.model';
import {
    ActivityParticipantsRequest,
    ActivityRoleResponse,
    UserActivityResponse,
    UserRoleAssignment
} from '../../models/user-activity.model';
import { User } from '../../models/user.model';
import { UserActivityService } from '../../services/user-activity.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-assignment-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './user-assignment-modal.component.html',
    styleUrls: ['./user-assignment-modal.component.css']
})
export class UserAssignmentModalComponent implements OnInit {
    @Input() isVisible = false;
    @Input() activity: Activity | null = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() assignmentUpdated = new EventEmitter<void>();

    assignmentForm: FormGroup;
    availableUsers: User[] = [];
    availableRoles: ActivityRoleResponse[] = [];
    currentParticipants: UserActivityResponse[] = [];
    loading = false;
    submitting = false;

    constructor(
        private fb: FormBuilder,
        private userActivityService: UserActivityService,
        private userService: UserService
    ) {
        this.assignmentForm = this.fb.group({
            assignments: this.fb.array([])
        });
    }

    ngOnInit() {
        if (this.activity) {
            this.loadData();
        }
    }

    ngOnChanges() {
        if (this.activity && this.isVisible) {
            this.loadData();
        }
    }

    get assignmentsFormArray(): FormArray {
        return this.assignmentForm.get('assignments') as FormArray;
    }

    private loadData() {
        this.loading = true;

        // Load available users, roles, and current participants
        Promise.all([
            this.loadUsers(),
            this.loadActivityRoles(),
            this.loadCurrentParticipants()
        ]).finally(() => {
            this.loading = false;
            this.setupForm();
        });
    }

    private loadUsers(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.userService.getAllUsers().subscribe({
                next: (users) => {
                    this.availableUsers = users || [];
                    resolve();
                },
                error: (error) => {
                    console.error('Error loading users:', error);
                    reject(error);
                }
            });
        });
    }

    private loadActivityRoles(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.activity) {
                reject('No activity selected');
                return;
            }

            this.userActivityService.getActivityRoles(this.activity.id).subscribe({
                next: (response) => {
                    this.availableRoles = response.result || [];
                    resolve();
                },
                error: (error) => {
                    console.error('Error loading activity roles:', error);
                    reject(error);
                }
            });
        });
    }

    private loadCurrentParticipants(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.activity) {
                reject('No activity selected');
                return;
            }

            this.userActivityService.getActivityParticipants(this.activity.id).subscribe({
                next: (response) => {
                    this.currentParticipants = response.result || [];
                    resolve();
                },
                error: (error) => {
                    console.error('Error loading current participants:', error);
                    reject(error);
                }
            });
        });
    }

    private setupForm() {
        // Clear existing form array
        while (this.assignmentsFormArray.length !== 0) {
            this.assignmentsFormArray.removeAt(0);
        }

        // Add current participants to form
        this.currentParticipants.forEach(participant => {
            this.addAssignmentControl(participant.user.id, participant.role.id, participant.notes);
        });

        // Add one empty row for new assignment
        this.addAssignmentControl();
    }

    addAssignmentControl(userId?: number, roleId?: number, notes?: string) {
        const assignmentGroup = this.fb.group({
            userId: [userId || '', Validators.required],
            roleId: [roleId || '', Validators.required],
            notes: [notes || '']
        });

        this.assignmentsFormArray.push(assignmentGroup);
    }

    removeAssignment(index: number) {
        this.assignmentsFormArray.removeAt(index);
    }

    addNewAssignment() {
        this.addAssignmentControl();
    }

    onSubmit() {
        if (this.assignmentForm.invalid || !this.activity) {
            return;
        }

        this.submitting = true;

        const assignments: UserRoleAssignment[] = this.assignmentForm.value.assignments
            .filter((assignment: any) => assignment.userId && assignment.roleId)
            .map((assignment: any) => ({
                userId: parseInt(assignment.userId),
                roleId: parseInt(assignment.roleId),
                notes: assignment.notes || ''
            }));

        const request: ActivityParticipantsRequest = {
            activityId: this.activity.id,
            assignments: assignments
        };

        this.userActivityService.updateActivityParticipants(this.activity.id, request).subscribe({
            next: (response) => {
                console.log('Participants updated successfully:', response);
                this.assignmentUpdated.emit();
                this.closeModal();
            },
            error: (error) => {
                console.error('Error updating participants:', error);
                // Handle error (show notification, etc.)
            },
            complete: () => {
                this.submitting = false;
            }
        });
    }

    getUserName(userId: number): string {
        const user = this.availableUsers.find(u => u.id === userId);
        return user ? (user.name || '') : '';
    }

    getRoleName(roleId: number): string {
        const role = this.availableRoles.find(r => r.role.id === roleId);
        return role ? role.role.name : '';
    }

    getRoleScore(roleId: number): number | null {
        const role = this.availableRoles.find(r => r.role.id === roleId);
        return role ? role.score : null;
    }

    isUserAlreadyAssigned(userId: number, currentIndex: number): boolean {
        if (!userId) return false;

        return this.assignmentsFormArray.controls.some((control, index) =>
            index !== currentIndex && control.get('userId')?.value == userId
        );
    }

    closeModal() {
        this.isVisible = false;
        this.visibleChange.emit(false);
    }

    onModalBackdropClick(event: Event) {
        if (event.target === event.currentTarget) {
            this.closeModal();
        }
    }
}
