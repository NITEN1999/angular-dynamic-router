import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CentralDataService, AnalyticsData } from '../../services/central-data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  data: AnalyticsData = {
    period: '',
    metrics: { pageViews: 0, uniqueVisitors: 0, bounceRate: 0, avgSessionDuration: '' },
    topPages: []
  };
  private destroy$ = new Subject<void>();

  constructor(private centralDataService: CentralDataService) {}

  ngOnInit(): void {
    console.log('Analytics component initialized');
    this.centralDataService.analyticsData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.data = data;
        console.log('Analytics received data update:', data);
      });
  }

  ngOnDestroy(): void {
    console.log('Analytics component destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }

  getProgressWidth(views: number): number {
    const maxViews = Math.max(...(this.data.topPages?.map((p: any) => p.views) || [1]));
    return (views / maxViews) * 100;
  }

  getBarHeight(visits: number): number {
    const maxVisits = Math.max(...(this.data.chartData?.map((d: any) => d.visits) || [1]));
    return (visits / maxVisits) * 100;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  refreshData(): void {
    const randomMultiplier = 1 + (Math.random() * 0.2 - 0.1); // +/- 10%
    const currentBounceRate = typeof this.data.metrics.bounceRate === 'string' 
      ? parseFloat(this.data.metrics.bounceRate) 
      : this.data.metrics.bounceRate;
    
    this.centralDataService.updateAnalyticsData({
      metrics: {
        pageViews: Math.floor(this.data.metrics.pageViews * randomMultiplier),
        uniqueVisitors: Math.floor(this.data.metrics.uniqueVisitors * randomMultiplier),
        bounceRate: (currentBounceRate * randomMultiplier).toFixed(1),
        avgSessionDuration: this.data.metrics.avgSessionDuration
      }
    });
    alert('Data refreshed!');
  }

  exportReport(): void {
    console.log('Exporting analytics report...', this.data);
    alert('Report exported successfully!');
  }
}
