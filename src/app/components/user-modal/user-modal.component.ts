import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './user-modal.component.html',
    styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit, OnChanges {
    @Input() user: User | null = null;
    @Input() isEditMode = false;
    @Output() userSaved = new EventEmitter<void>();
    @Output() modalClosed = new EventEmitter<void>();

    userForm!: FormGroup;
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private userService: UserService
    ) { }

    ngOnInit(): void {
        this.initializeForm();
    }

    ngOnChanges(): void {
        if (this.userForm) {
            this.initializeForm();
        }
    }

    private initializeForm(): void {
        this.userForm = this.fb.group({
            username: [this.user?.username || '', [Validators.required, Validators.minLength(3)]],
            email: [this.user?.email || '', [Validators.required, Validators.email]],
            workEmail: [this.user?.workEmail || '', [Validators.required, Validators.email]],
            name: [this.user?.name || '', [Validators.required]],
            unit: [this.user?.unit || '', [Validators.required]],
            academicRank: [this.user?.academicRank || ''],
            degree: [this.user?.degree || ''],
            phoneNumber: [this.user?.phoneNumber || '', [Validators.required]],
            notes: [this.user?.notes || '']
        });

        // Add password field only for create mode
        if (!this.isEditMode) {
            this.userForm.addControl('password', this.fb.control('', [Validators.required, Validators.minLength(6)]));
        }
    }

    get modalTitle(): string {
        return this.isEditMode ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới';
    }

    get submitButtonText(): string {
        if (this.loading) {
            return this.isEditMode ? 'Đang cập nhật...' : 'Đang tạo...';
        }
        return this.isEditMode ? 'Cập nhật' : 'Tạo mới';
    }

    onSubmit(): void {
        if (this.userForm.invalid) {
            this.markFormGroupTouched();
            return;
        }

        this.loading = true;
        this.error = '';

        const formData = this.userForm.value;

        if (this.isEditMode && this.user?.id) {
            // Update user
            const updateData = { ...formData };
            delete updateData.password; // Don't send password in update

            this.userService.updateUser(this.user.id, updateData).subscribe({
                next: () => {
                    this.userSaved.emit();
                },
                error: (error) => {
                    this.error = error.error?.message || 'Không thể cập nhật người dùng';
                    this.loading = false;
                }
            });
        } else {
            // Create user
            this.userService.createUser(formData).subscribe({
                next: () => {
                    this.userSaved.emit();
                },
                error: (error) => {
                    this.error = error.error?.message || 'Không thể tạo người dùng';
                    this.loading = false;
                }
            });
        }
    }

    onCancel(): void {
        this.modalClosed.emit();
    }

    private markFormGroupTouched(): void {
        Object.keys(this.userForm.controls).forEach(key => {
            const control = this.userForm.get(key);
            control?.markAsTouched();
        });
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.userForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    getFieldError(fieldName: string): string {
        const field = this.userForm.get(fieldName);
        if (field?.errors) {
            if (field.errors['required']) return `${this.getFieldDisplayName(fieldName)} là bắt buộc`;
            if (field.errors['email']) return 'Email không hợp lệ';
            if (field.errors['minlength']) return `${this.getFieldDisplayName(fieldName)} tối thiểu ${field.errors['minlength'].requiredLength} ký tự`;
        }
        return '';
    }

    private getFieldDisplayName(fieldName: string): string {
        const fieldNames: { [key: string]: string } = {
            username: 'Tên đăng nhập',
            email: 'Email cá nhân',
            workEmail: 'Email công việc',
            password: 'Mật khẩu',
            name: 'Họ và tên',
            unit: 'Đơn vị',
            phoneNumber: 'Số điện thoại',
            academicRank: 'Học hàm',
            degree: 'Học vị',
            notes: 'Ghi chú'
        };
        return fieldNames[fieldName] || fieldName;
    }
}
