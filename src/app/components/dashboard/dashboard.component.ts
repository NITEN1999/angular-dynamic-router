import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentralDataService, DashboardData } from '../../services/central-data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  data: DashboardData = {
    title: '',
    stats: { users: 0, revenue: 0, tasks: 0, projects: 0 },
    recentActivity: []
  };
  private destroy$ = new Subject<void>();

  constructor(private centralDataService: CentralDataService) {}

  ngOnInit(): void {
    console.log('Dashboard component initialized');
    this.centralDataService.dashboardData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.data = data;
        console.log('Dashboard received data update:', data);
      });
  }

  ngOnDestroy(): void {
    console.log('Dashboard component destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateStats(): void {
    const randomIncrease = Math.floor(Math.random() * 100);
    this.centralDataService.updateDashboardData({
      stats: {
        users: (this.data.stats?.users || 0) + randomIncrease,
        revenue: (this.data.stats?.revenue || 0) + (randomIncrease * 100),
        tasks: (this.data.stats?.tasks || 0) + Math.floor(randomIncrease / 10),
        projects: (this.data.stats?.projects || 0) + Math.floor(randomIncrease / 50)
      }
    });
  }

  addActivity(): void {
    const activities = [
      'New user registered',
      'Order completed',
      'Task assigned',
      'Project created',
      'Report generated'
    ];
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    const currentActivities = this.data.recentActivity || [];
    this.centralDataService.updateDashboardData({
      recentActivity: [
        { action: randomActivity, time: 'Just now' },
        ...currentActivities.slice(0, 4)
      ]
    });
  }
}
