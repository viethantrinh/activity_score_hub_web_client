import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Activity, ActivityListItem } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';
import { ActivityModalComponent } from '../activity-modal/activity-modal.component';

@Component({
    selector: 'app-activity-management',
    standalone: true,
    imports: [CommonModule, FormsModule, ActivityModalComponent],
    templateUrl: './activity-management.component.html',
    styleUrls: ['./activity-management.component.css']
})
export class ActivityManagementComponent implements OnInit {
    activities: ActivityListItem[] = [];
    filteredActivities: ActivityListItem[] = [];
    selectedActivity: Activity | null = null;
    showActivityModal = false;
    isEditMode = false;
    loading = false;
    Math = Math;

    // Filters
    searchTerm = '';
    sortBy = 'name';
    sortDirection = 'asc';

    // Pagination
    currentPage = 1;
    pageSize = 10;
    totalPages = 1;
    totalItems = 0;

    constructor(private activityService: ActivityService) { }

    ngOnInit(): void {
        this.loadActivities();
    }

    loadActivities(): void {
        this.loading = true;
        this.activityService.getAllActivities().subscribe({
            next: (response) => {
                this.activities = response.result;
                this.totalItems = response.result.length;
                this.totalPages = Math.ceil(this.totalItems / this.pageSize);
                this.applyFilters();
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading activities:', error);
                this.loading = false;
            }
        });
    }

    applyFilters(): void {
        let filtered = [...this.activities];

        // Search filter
        if (this.searchTerm) {
            filtered = filtered.filter(activity =>
                activity.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                activity.description.toLowerCase().includes(this.searchTerm.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            let aValue = a[this.sortBy as keyof ActivityListItem];
            let bValue = b[this.sortBy as keyof ActivityListItem];

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

        this.filteredActivities = filtered;
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

    openCreateActivityModal(): void {
        this.selectedActivity = null;
        this.isEditMode = false;
        this.showActivityModal = true;
    }

    openEditActivityModal(activity: ActivityListItem): void {
        // Load full activity details before editing
        this.activityService.getActivityById(activity.id).subscribe({
            next: (response) => {
                this.selectedActivity = { ...response.result };
                this.isEditMode = true;
                this.showActivityModal = true;
            },
            error: (error) => {
                console.error('Error loading activity details:', error);
                alert('Có lỗi xảy ra khi tải thông tin hoạt động');
            }
        });
    }

    closeActivityModal(): void {
        this.showActivityModal = false;
        this.selectedActivity = null;
    }

    onActivitySaved(): void {
        this.closeActivityModal();
        this.loadActivities();
    }

    deleteActivity(activity: ActivityListItem): void {
        if (confirm(`Bạn có chắc chắn muốn xóa hoạt động "${activity.name}"?`)) {
            this.activityService.deleteActivity(activity.id).subscribe({
                next: () => {
                    this.loadActivities();
                },
                error: (error) => {
                    console.error('Error deleting activity:', error);
                    alert('Có lỗi xảy ra khi xóa hoạt động');
                }
            });
        }
    }

    changePage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
        }
    }

    getPaginatedActivities(): ActivityListItem[] {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        return this.filteredActivities.slice(startIndex, endIndex);
    }

    formatDate(dateString: string): string {
        return new Date(dateString).toLocaleDateString('vi-VN');
    }

    formatDateTime(dateString: string): string {
        return new Date(dateString).toLocaleString('vi-VN');
    }
}
