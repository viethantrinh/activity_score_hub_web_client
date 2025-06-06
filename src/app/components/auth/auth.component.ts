import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignInRequest, SignUpRequest } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
    isLoginMode = true;
    loginForm!: FormGroup;
    registerForm!: FormGroup;
    loading = false;
    error = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initializeForms();
        this.checkAuthentication();
    }

    private initializeForms(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.registerForm = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            workEmail: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            name: ['', [Validators.required]],
            unit: ['', [Validators.required]],
            academicRank: [''],
            degree: [''],
            phoneNumber: ['', [Validators.required]],
            notes: ['']
        });
    }

    private checkAuthentication(): void {
        if (this.authService.isAuthenticated()) {
            this.authService.introspectToken().subscribe(valid => {
                if (valid) {
                    this.router.navigate(['/dashboard']);
                }
            });
        }
    } toggleMode(): void {
        this.isLoginMode = !this.isLoginMode;
        this.error = '';
        console.log('Toggle mode - isLoginMode:', this.isLoginMode);
    }

    onLogin(): void {
        if (this.loginForm.invalid) {
            this.markFormGroupTouched(this.loginForm);
            return;
        }

        this.loading = true;
        this.error = '';

        const loginData: SignInRequest = this.loginForm.value;

        this.authService.signIn(loginData).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (error) => {
                this.error = error.error?.message || 'Đăng nhập thất bại';
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    onRegister(): void {
        if (this.registerForm.invalid) {
            this.markFormGroupTouched(this.registerForm);
            return;
        }

        this.loading = true;
        this.error = '';

        const registerData: SignUpRequest = this.registerForm.value;

        this.authService.signUp(registerData).subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: (error) => {
                this.error = error.error?.message || 'Đăng ký thất bại';
                this.loading = false;
            },
            complete: () => {
                this.loading = false;
            }
        });
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            control?.markAsTouched();
        });
    }

    isFieldInvalid(form: FormGroup, fieldName: string): boolean {
        const field = form.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    getFieldError(form: FormGroup, fieldName: string): string {
        const field = form.get(fieldName);
        if (field?.errors) {
            if (field.errors['required']) return `${fieldName} là bắt buộc`;
            if (field.errors['email']) return 'Email không hợp lệ';
            if (field.errors['minlength']) return `${fieldName} tối thiểu ${field.errors['minlength'].requiredLength} ký tự`;
        }
        return '';
    }
}
