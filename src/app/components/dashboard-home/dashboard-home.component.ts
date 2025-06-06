import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-dashboard-home',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dashboard-home.component.html',
    styleUrls: ['./dashboard-home.component.css']
})
export class DashboardHomeComponent implements OnInit {
    stats = {
        totalUsers: 0,
        activeUsers: 0,
        totalActivities: 0,
        totalScore: 0
    };

    constructor() { }

    ngOnInit(): void {
        this.loadStats();
    }

    private loadStats(): void {
        // TODO: Load actual stats from API
        this.stats = {
            totalUsers: 156,
            activeUsers: 98,
            totalActivities: 234,
            totalScore: 8945
        };
    }
}
