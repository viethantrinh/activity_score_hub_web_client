import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { UserModalComponent } from '../user-modal/user-modal.component';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule, FormsModule, UserModalComponent],
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
    users: User[] = [];
    filteredUsers: User[] = [];
    loading = false;
    error = '';
    searchTerm = '';
    selectedUser: User | null = null;
    showUserModal = false;
    isEditMode = false;

    // Responsive
    isMobile = false;

    // Pagination
    currentPage = 1;
    itemsPerPage = 10;

    // Make Math available in template
    Math = Math;
    totalPages = 0;

    // Filters
    filterRole = '';
    filterUnit = '';

    constructor(private userService: UserService) {
        this.checkScreenSize();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        this.checkScreenSize();
    }

    private checkScreenSize(): void {
        this.isMobile = window.innerWidth <= 768;
        // Adjust items per page for mobile
        this.itemsPerPage = this.isMobile ? 5 : 10;
        if (this.filteredUsers.length > 0) {
            this.calculatePagination();
        }
    }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.loading = true;
        this.error = '';

        this.userService.getAllUsers().subscribe({
            next: (users) => {
                this.users = users;
                this.applyFilters();
                this.loading = false;
            },
            error: (error) => {
                this.error = error.error?.message || 'Không thể tải danh sách người dùng';
                this.loading = false;
            }
        });
    }

    applyFilters(): void {
        let filtered = [...this.users];

        // Search filter
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(user =>
                (user.name?.toLowerCase() || '').includes(term) ||
                (user.email?.toLowerCase() || '').includes(term) ||
                (user.username?.toLowerCase() || '').includes(term) ||
                (user.unit?.toLowerCase() || '').includes(term)
            );
        }

        // Role filter
        if (this.filterRole) {
            filtered = filtered.filter(user =>
                user.systemRoles?.includes(this.filterRole) || false
            );
        }

        // Unit filter
        if (this.filterUnit) {
            filtered = filtered.filter(user =>
                (user.unit?.toLowerCase() || '').includes(this.filterUnit.toLowerCase())
            );
        }

        this.filteredUsers = filtered;
        this.calculatePagination();
    }

    calculatePagination(): void {
        this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
        if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
        }
    }

    get paginatedUsers(): User[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredUsers.slice(startIndex, endIndex);
    }

    get pageNumbers(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    onSearch(): void {
        this.currentPage = 1;
        this.applyFilters();
    }

    onFilterChange(): void {
        this.currentPage = 1;
        this.applyFilters();
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.filterRole = '';
        this.filterUnit = '';
        this.currentPage = 1;
        this.applyFilters();
    }

    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    openCreateUserModal(): void {
        this.selectedUser = null;
        this.isEditMode = false;
        this.showUserModal = true;
    }

    openEditUserModal(user: User): void {
        this.selectedUser = { ...user };
        this.isEditMode = true;
        this.showUserModal = true;
    }

    closeUserModal(): void {
        this.showUserModal = false;
        this.selectedUser = null;
        this.isEditMode = false;
    }

    onUserSaved(): void {
        this.closeUserModal();
        this.loadUsers();
    }

    deleteUser(user: User): void {
        if (confirm(`Bạn có chắc chắn muốn xóa người dùng "${user.name}"?`)) {
            this.userService.deleteUser(user.id!).subscribe({
                next: () => {
                    this.loadUsers();
                },
                error: (error) => {
                    alert('Không thể xóa người dùng: ' + (error.error?.message || 'Lỗi không xác định'));
                }
            });
        }
    }

    getRoleBadgeClass(roles: string[] | undefined): string {
        if (roles?.includes('ADMIN')) {
            return 'bg-danger';
        }
        return 'bg-primary';
    }

    getRoleDisplayText(roles: string[] | undefined): string {
        if (roles?.includes('ADMIN')) {
            return 'Quản trị viên';
        }
        return 'Người dùng';
    }
}
