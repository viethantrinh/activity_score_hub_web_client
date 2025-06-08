import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from '../../models/role.model';
import { RoleService } from '../../services/role.service';
import { RoleModalComponent } from '../role-modal/role-modal.component';

@Component({
    selector: 'app-role-management',
    standalone: true,
    imports: [CommonModule, FormsModule, RoleModalComponent],
    templateUrl: './role-management.component.html',
    styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {
    roles: Role[] = [];
    filteredRoles: Role[] = [];
    loading = false;
    error = '';
    searchTerm = '';
    selectedRole: Role | null = null;
    showRoleModal = false;
    isEditMode = false;

    // Responsive
    isMobile = false;

    // Pagination
    currentPage = 1;
    itemsPerPage = 10;

    // Make Math available in template
    Math = Math;
    totalPages = 0;

    // Sorting
    sortBy = 'name';
    sortDirection = 'asc';

    constructor(private roleService: RoleService) {
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
        if (this.filteredRoles.length > 0) {
            this.calculatePagination();
        }
    }

    ngOnInit(): void {
        this.loadRoles();
    }

    loadRoles(): void {
        this.loading = true;
        this.error = '';

        this.roleService.getAllRoles().subscribe({
            next: (response) => {
                this.roles = response.result;
                this.applyFilters();
                this.loading = false;
            },
            error: (error) => {
                this.error = error.error?.message || 'Không thể tải danh sách vai trò';
                this.loading = false;
            }
        });
    }

    applyFilters(): void {
        let filtered = [...this.roles];

        // Search filter
        if (this.searchTerm) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(role =>
                role.name.toLowerCase().includes(term) ||
                (role.description && role.description.toLowerCase().includes(term))
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aValue = a[this.sortBy as keyof Role];
            let bValue = b[this.sortBy as keyof Role];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
            }
            if (typeof bValue === 'string') {
                bValue = bValue.toLowerCase();
            }

            if (this.sortDirection === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        this.filteredRoles = filtered;
        this.calculatePagination();
    }

    calculatePagination(): void {
        this.totalPages = Math.ceil(this.filteredRoles.length / this.itemsPerPage);
        if (this.currentPage > this.totalPages) {
            this.currentPage = 1;
        }
    }

    get paginatedRoles(): Role[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredRoles.slice(startIndex, endIndex);
    }

    get pageNumbers(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    onSearch(): void {
        this.currentPage = 1;
        this.applyFilters();
    }

    onSortChange(field: string): void {
        if (this.sortBy === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = field;
            this.sortDirection = 'asc';
        }
        this.applyFilters();
    }

    getSortIcon(field: string): string {
        if (this.sortBy !== field) return 'bi-arrow-down-up';
        return this.sortDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.currentPage = 1;
        this.applyFilters();
    }

    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    openCreateRoleModal(): void {
        this.selectedRole = null;
        this.isEditMode = false;
        this.showRoleModal = true;
    }

    openEditRoleModal(role: Role): void {
        this.selectedRole = { ...role };
        this.isEditMode = true;
        this.showRoleModal = true;
    }

    closeRoleModal(): void {
        this.showRoleModal = false;
        this.selectedRole = null;
        this.isEditMode = false;
    }

    onRoleSaved(): void {
        this.closeRoleModal();
        this.loadRoles();
    }

    deleteRole(role: Role): void {
        const confirmMessage = `Bạn có chắc chắn muốn xóa vai trò "${role.name}"?\n\nLưu ý: Vai trò đang được sử dụng trong hoạt động sẽ không thể xóa.`;

        if (confirm(confirmMessage)) {
            this.roleService.deleteRole(role.id).subscribe({
                next: () => {
                    this.loadRoles();
                },
                error: (error) => {
                    let errorMessage = 'Không thể xóa vai trò';

                    // Handle specific error cases
                    if (error.error?.code === 5007) {
                        errorMessage = 'Không thể xóa vai trò này vì đang được sử dụng trong hoạt động';
                    } else if (error.error?.message) {
                        errorMessage = error.error.message;
                    }

                    alert(errorMessage);
                }
            });
        }
    }
}
