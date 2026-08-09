import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DashboardData {
  title: string;
  stats: {
    users: number;
    revenue: number;
    tasks: number;
    projects: number;
  };
  recentActivity: Array<{
    action: string;
    time: string;
  }>;
}

export interface ProfileData {
  name: string;
  email: string;
  role: string;
  avatar: string;
  bio: string;
  joinDate?: string;
  location?: string;
}

export interface SettingsData {
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisible: boolean;
    showEmail: boolean;
    showLocation: boolean;
  };
  language: string;
  timezone: string;
}

export interface AnalyticsData {
  period: string;
  metrics: {
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number | string;
    avgSessionDuration: string;
  };
  topPages: Array<{
    page: string;
    views: number;
  }>;
  chartData?: Array<{
    date: string;
    visits: number;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class CentralDataService {
  // Data stores for each component
  private dashboardDataSubject = new BehaviorSubject<DashboardData>({
    title: 'Dashboard',
    stats: {
      users: 1250,
      revenue: 45000,
      tasks: 89,
      projects: 12
    },
    recentActivity: [
      { action: 'User registered', time: '2 min ago' },
      { action: 'New order received', time: '5 min ago' },
      { action: 'Task completed', time: '10 min ago' }
    ]
  });

  private profileDataSubject = new BehaviorSubject<ProfileData>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Administrator',
    avatar: 'https://via.placeholder.com/150',
    bio: 'Full-stack developer passionate about Angular',
    joinDate: '2024-01-15',
    location: 'San Francisco, CA'
  });

  private settingsDataSubject = new BehaviorSubject<SettingsData>({
    theme: 'dark',
    notifications: {
      email: true,
      push: false,
      sms: true
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showLocation: true
    },
    language: 'en',
    timezone: 'UTC-8'
  });

  private analyticsDataSubject = new BehaviorSubject<AnalyticsData>({
    period: 'Last 30 Days',
    metrics: {
      pageViews: 23456,
      uniqueVisitors: 8934,
      bounceRate: 34.5,
      avgSessionDuration: '3m 45s'
    },
    topPages: [
      { page: '/dashboard', views: 5678 },
      { page: '/profile', views: 3421 },
      { page: '/analytics', views: 2987 }
    ],
    chartData: [
      { date: '2024-01-01', visits: 345 },
      { date: '2024-01-02', visits: 456 },
      { date: '2024-01-03', visits: 389 }
    ]
  });

  // Public observables
  public dashboardData$: Observable<DashboardData> = this.dashboardDataSubject.asObservable();
  public profileData$: Observable<ProfileData> = this.profileDataSubject.asObservable();
  public settingsData$: Observable<SettingsData> = this.settingsDataSubject.asObservable();
  public analyticsData$: Observable<AnalyticsData> = this.analyticsDataSubject.asObservable();

  constructor() {
    console.log('CentralDataService initialized');
  }

  // Dashboard methods
  updateDashboardData(data: Partial<DashboardData>): void {
    const currentData = this.dashboardDataSubject.value;
    this.dashboardDataSubject.next({ ...currentData, ...data });
    console.log('Dashboard data updated:', data);
  }

  getDashboardData(): DashboardData {
    return this.dashboardDataSubject.value;
  }

  // Profile methods
  updateProfileData(data: Partial<ProfileData>): void {
    const currentData = this.profileDataSubject.value;
    this.profileDataSubject.next({ ...currentData, ...data });
    console.log('Profile data updated:', data);
  }

  getProfileData(): ProfileData {
    return this.profileDataSubject.value;
  }

  // Settings methods
  updateSettingsData(data: Partial<SettingsData>): void {
    const currentData = this.settingsDataSubject.value;
    this.settingsDataSubject.next({ ...currentData, ...data });
    console.log('Settings data updated:', data);
  }

  getSettingsData(): SettingsData {
    return this.settingsDataSubject.value;
  }

  // Analytics methods
  updateAnalyticsData(data: Partial<AnalyticsData>): void {
    const currentData = this.analyticsDataSubject.value;
    this.analyticsDataSubject.next({ ...currentData, ...data });
    console.log('Analytics data updated:', data);
  }

  getAnalyticsData(): AnalyticsData {
    return this.analyticsDataSubject.value;
  }

  // Generic method to get all data
  getAllData(): any {
    return {
      dashboard: this.getDashboardData(),
      profile: this.getProfileData(),
      settings: this.getSettingsData(),
      analytics: this.getAnalyticsData()
    };
  }

  // Reset all data to defaults
  resetAllData(): void {
    this.dashboardDataSubject.next({
      title: 'Dashboard',
      stats: { users: 0, revenue: 0, tasks: 0, projects: 0 },
      recentActivity: []
    });
    this.profileDataSubject.next({
      name: '',
      email: '',
      role: '',
      avatar: '',
      bio: ''
    });
    this.settingsDataSubject.next({
      theme: 'light',
      notifications: { email: false, push: false, sms: false },
      privacy: { profileVisible: false, showEmail: false, showLocation: false },
      language: 'en',
      timezone: 'UTC+0'
    });
    this.analyticsDataSubject.next({
      period: '',
      metrics: { pageViews: 0, uniqueVisitors: 0, bounceRate: 0, avgSessionDuration: '0m 0s' },
      topPages: []
    });
    console.log('All data reset to defaults');
  }
}
