import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Activity, ActivityRole } from '../../models/activity.model';
import { Role } from '../../models/role.model';
import { ActivityService } from '../../services/activity.service';
import { RoleService } from '../../services/role.service';

@Component({
    selector: 'app-activity-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './activity-modal.component.html',
    styleUrls: ['./activity-modal.component.css']
})
export class ActivityModalComponent implements OnInit {
    @Input() activity: Activity | null = null;
    @Input() isEditMode = false;
    @Output() activitySaved = new EventEmitter<void>();
    @Output() modalClosed = new EventEmitter<void>();

    activityForm!: FormGroup;
    roles: Role[] = [];
    loading = false;
    saving = false;

    constructor(
        private fb: FormBuilder,
        private activityService: ActivityService,
        private roleService: RoleService
    ) { }

    ngOnInit(): void {
        this.loadRoles();
        this.initForm();
    }

    loadRoles(): void {
        this.roleService.getAllRoles().subscribe({
            next: (response: any) => {
                this.roles = response.result;
            },
            error: (error: any) => {
                console.error('Error loading roles:', error);
            }
        });
    }

    initForm(): void {
        this.activityForm = this.fb.group({
            name: [this.activity?.name || '', [Validators.required, Validators.maxLength(255)]],
            description: [this.activity?.description || '', [Validators.required]],
            startDate: [this.formatDateForInput(this.activity?.startDate), [Validators.required]],
            endDate: [this.formatDateForInput(this.activity?.endDate), [Validators.required]],
            roles: this.fb.array([])
        });

        // Initialize activity roles
        if (this.activity?.roles?.length) {
            this.activity.roles.forEach((role: ActivityRole) => {
                this.addActivityRole(role);
            });
        } else {
            this.addActivityRole();
        }
    }

    get activityRoles(): FormArray {
        return this.activityForm.get('roles') as FormArray;
    }

    addActivityRole(role?: ActivityRole): void {
        const roleForm = this.fb.group({
            roleId: [role?.roleId || '', [Validators.required]],
            roleName: [role?.roleName || ''],
            score: [role?.score || 0, [Validators.required, Validators.min(0)]]
        });

        // Update role name when role changes
        roleForm.get('roleId')?.valueChanges.subscribe(roleId => {
            const selectedRole = this.roles.find(r => r.id === roleId);
            if (selectedRole) {
                roleForm.patchValue({ roleName: selectedRole.name });
            }
        });

        this.activityRoles.push(roleForm);
    }

    removeActivityRole(index: number): void {
        if (this.activityRoles.length > 1) {
            this.activityRoles.removeAt(index);
        }
    }

    formatDateForInput(dateString?: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }

    onSubmit(): void {
        if (this.activityForm.valid) {
            this.saving = true;
            const formValue = this.activityForm.value;

            // Filter out activity roles with empty roleId
            formValue.roles = formValue.roles.filter((role: any) => role.roleId);

            if (this.isEditMode && this.activity?.id) {
                this.activityService.updateActivity(this.activity.id, formValue).subscribe({
                    next: () => {
                        this.activitySaved.emit();
                        this.saving = false;
                    },
                    error: (error) => {
                        console.error('Error updating activity:', error);
                        this.saving = false;
                        alert('Có lỗi xảy ra khi cập nhật hoạt động');
                    }
                });
            } else {
                this.activityService.createActivity(formValue).subscribe({
                    next: () => {
                        this.activitySaved.emit();
                        this.saving = false;
                    },
                    error: (error) => {
                        console.error('Error creating activity:', error);
                        this.saving = false;
                        alert('Có lỗi xảy ra khi tạo hoạt động');
                    }
                });
            }
        } else {
            this.markFormGroupTouched();
        }
    }

    onCancel(): void {
        this.modalClosed.emit();
    }

    markFormGroupTouched(): void {
        Object.keys(this.activityForm.controls).forEach(key => {
            const control = this.activityForm.get(key);
            control?.markAsTouched();

            if (control instanceof FormArray) {
                control.controls.forEach(nestedControl => {
                    if (nestedControl instanceof FormGroup) {
                        Object.keys(nestedControl.controls).forEach(nestedKey => {
                            nestedControl.get(nestedKey)?.markAsTouched();
                        });
                    }
                });
            }
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.activityForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    isActivityRoleFieldInvalid(index: number, fieldName: string): boolean {
        const field = this.activityRoles.at(index)?.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldError(fieldName: string): string {
        const field = this.activityForm.get(fieldName);
        if (field?.errors) {
            if (field.errors['required']) return `${this.getFieldLabel(fieldName)} là bắt buộc`;
            if (field.errors['maxlength']) return `${this.getFieldLabel(fieldName)} không được vượt quá ${field.errors['maxlength'].requiredLength} ký tự`;
            if (field.errors['min']) return `${this.getFieldLabel(fieldName)} phải lớn hơn hoặc bằng ${field.errors['min'].min}`;
        }
        return '';
    }

    getActivityRoleFieldError(index: number, fieldName: string): string {
        const field = this.activityRoles.at(index)?.get(fieldName);
        if (field?.errors) {
            if (field.errors['required']) return `${this.getActivityRoleFieldLabel(fieldName)} là bắt buộc`;
            if (field.errors['min']) return `${this.getActivityRoleFieldLabel(fieldName)} phải lớn hơn hoặc bằng ${field.errors['min'].min}`;
        }
        return '';
    }

    getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            name: 'Tên hoạt động',
            description: 'Mô tả',
            startDate: 'Ngày bắt đầu',
            endDate: 'Ngày kết thúc',
            location: 'Địa điểm',
            status: 'Trạng thái'
        };
        return labels[fieldName] || fieldName;
    }

    getActivityRoleFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            roleId: 'Vai trò',
            score: 'Điểm số'
        };
        return labels[fieldName] || fieldName;
    }
}
