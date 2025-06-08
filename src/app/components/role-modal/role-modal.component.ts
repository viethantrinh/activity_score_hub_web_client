import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Role } from '../../models/role.model';
import { CreateRoleRequest, RoleService, UpdateRoleRequest } from '../../services/role.service';

@Component({
    selector: 'app-role-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './role-modal.component.html',
    styleUrls: ['./role-modal.component.css']
})
export class RoleModalComponent implements OnInit, OnChanges {
    @Input() role: Role | null = null;
    @Input() isEditMode = false;
    @Output() roleSaved = new EventEmitter<void>();
    @Output() modalClosed = new EventEmitter<void>();

    roleForm!: FormGroup;
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private roleService: RoleService
    ) { }

    ngOnInit(): void {
        this.initializeForm();
    }

    ngOnChanges(): void {
        if (this.roleForm) {
            this.initializeForm();
        }
    }

    private initializeForm(): void {
        this.roleForm = this.fb.group({
            name: [this.role?.name || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            description: [this.role?.description || '', [Validators.maxLength(255)]]
        });
    }

    get modalTitle(): string {
        return this.isEditMode ? 'Chỉnh sửa vai trò' : 'Thêm vai trò mới';
    }

    get submitButtonText(): string {
        return this.isEditMode ? 'Cập nhật' : 'Tạo mới';
    }

    onSubmit(): void {
        if (this.roleForm.invalid) {
            this.markFormGroupTouched(this.roleForm);
            return;
        }

        this.loading = true;
        this.error = '';

        const formValue = this.roleForm.value;

        if (this.isEditMode && this.role) {
            // Update existing role
            const updateRequest: UpdateRoleRequest = {
                name: formValue.name !== this.role.name ? formValue.name : undefined,
                description: formValue.description !== this.role.description ? formValue.description : undefined
            };

            // Only send the request if there are actually changes
            if (updateRequest.name || updateRequest.description !== undefined) {
                this.roleService.updateRole(this.role.id, updateRequest).subscribe({
                    next: () => {
                        this.roleSaved.emit();
                        this.loading = false;
                    },
                    error: (error) => {
                        this.handleError(error);
                        this.loading = false;
                    }
                });
            } else {
                // No changes, just close the modal
                this.onCancel();
                this.loading = false;
            }
        } else {
            // Create new role
            const createRequest: CreateRoleRequest = {
                name: formValue.name,
                description: formValue.description || undefined
            };

            this.roleService.createRole(createRequest).subscribe({
                next: () => {
                    this.roleSaved.emit();
                    this.loading = false;
                },
                error: (error) => {
                    this.handleError(error);
                    this.loading = false;
                }
            });
        }
    }

    private handleError(error: any): void {
        if (error.error?.code === 5006) {
            this.error = 'Tên vai trò đã tồn tại. Vui lòng chọn tên khác.';
        } else if (error.error?.message) {
            this.error = error.error.message;
        } else {
            this.error = this.isEditMode ? 'Cập nhật vai trò thất bại' : 'Tạo vai trò thất bại';
        }
    }

    onCancel(): void {
        this.modalClosed.emit();
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.roleForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldError(fieldName: string): string {
        const field = this.roleForm.get(fieldName);
        if (field && field.errors) {
            if (field.errors['required']) {
                return `${this.getFieldLabel(fieldName)} là bắt buộc`;
            }
            if (field.errors['minlength']) {
                return `${this.getFieldLabel(fieldName)} phải có ít nhất ${field.errors['minlength'].requiredLength} ký tự`;
            }
            if (field.errors['maxlength']) {
                return `${this.getFieldLabel(fieldName)} không được vượt quá ${field.errors['maxlength'].requiredLength} ký tự`;
            }
        }
        return '';
    }

    private getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            'name': 'Tên vai trò',
            'description': 'Mô tả'
        };
        return labels[fieldName] || fieldName;
    }
}
