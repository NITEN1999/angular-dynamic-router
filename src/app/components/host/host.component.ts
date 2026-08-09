import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { NavigationService, ComponentConfig } from '../../services/navigation.service';
import { CentralDataService } from '../../services/central-data.service';
import { Subject, takeUntil } from 'rxjs';

// Import all child components
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProfileComponent } from '../profile/profile.component';
import { SettingsComponent } from '../settings/settings.component';
import { AnalyticsComponent } from '../analytics/analytics.component';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [CommonModule, NgComponentOutlet],
  template: `
    <div class="host-container">
      <!-- Navigation Bar -->
      <nav class="navigation-bar">
        <div class="nav-brand">
          <h1>Dynamic Router</h1>
          <p class="nav-subtitle">Array-Based Navigation</p>
        </div>

        <div class="nav-components">
          <button
            *ngFor="let comp of components; let i = index"
            class="nav-button"
            [class.active]="currentIndex === i"
            (click)="navigateToIndex(i)">
            <span class="nav-icon">{{ getIcon(comp.name) }}</span>
            <span class="nav-text">{{ comp.name }}</span>
          </button>
        </div>

        <div class="nav-info">
          <span class="component-count">{{ currentIndex + 1 }} / {{ components.length }}</span>
        </div>
      </nav>

      <!-- Component Display Area -->
      <div class="content-area">
        <div class="component-header">
          <div class="breadcrumb">
            <span class="breadcrumb-home">Home</span>
            <span class="breadcrumb-separator">›</span>
            <span class="breadcrumb-current">{{ currentComponent?.name }}</span>
          </div>
          
          <div class="navigation-controls">
            <button 
              class="control-btn" 
              (click)="previous()"
              [disabled]="components.length === 0">
              ‹ Previous
            </button>
            <button 
              class="control-btn" 
              (click)="next()"
              [disabled]="components.length === 0">
              Next ›
            </button>
          </div>
        </div>

        <!-- Dynamic Component Outlet -->
        <div class="dynamic-component-container">
          <ng-container *ngComponentOutlet="currentComponent?.component || null" />
        </div>
      </div>

      <!-- Footer -->
      <footer class="footer">
        <p>Currently viewing: <strong>{{ currentComponent?.name }}</strong></p>
        <p class="footer-note">Using ngComponentOutlet for dynamic rendering</p>
      </footer>
    </div>
  `,
  styles: [`
    .host-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #f5f7fa;
    }

    /* Navigation Bar */
    .navigation-bar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      gap: 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-brand {
      flex-shrink: 0;
    }

    .nav-brand h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 700;
    }

    .nav-subtitle {
      margin: 0;
      font-size: 0.75rem;
      opacity: 0.9;
    }

    .nav-components {
      display: flex;
      gap: 0.5rem;
      flex: 1;
      justify-content: center;
    }

    .nav-button {
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid transparent;
      color: white;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s;
      font-weight: 500;
    }

    .nav-button:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .nav-button.active {
      background: white;
      color: #667eea;
      border-color: white;
    }

    .nav-icon {
      font-size: 1.2rem;
    }

    .nav-info {
      flex-shrink: 0;
    }

    .component-count {
      background: rgba(255, 255, 255, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    /* Content Area */
    .content-area {
      flex: 1;
      padding: 2rem;
    }

    .component-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding: 0 0.5rem;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.9rem;
    }

    .breadcrumb-home {
      color: #999;
    }

    .breadcrumb-separator {
      color: #ccc;
    }

    .breadcrumb-current {
      color: #667eea;
      font-weight: 600;
    }

    .navigation-controls {
      display: flex;
      gap: 0.75rem;
    }

    .control-btn {
      background: white;
      border: 2px solid #e0e0e0;
      color: #333;
      padding: 0.5rem 1.25rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
    }

    .control-btn:hover:not(:disabled) {
      border-color: #667eea;
      color: #667eea;
      transform: translateX(0);
    }

    .control-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* Dynamic Component Container */
    .dynamic-component-container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      padding: 1.5rem;
      min-height: 500px;
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Footer */
    .footer {
      background: white;
      border-top: 1px solid #e0e0e0;
      padding: 1.5rem 2rem;
      text-align: center;
      color: #666;
    }

    .footer p {
      margin: 0.25rem 0;
    }

    .footer strong {
      color: #667eea;
    }

    .footer-note {
      font-size: 0.85rem;
      color: #999;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .navigation-bar {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .nav-components {
        flex-wrap: wrap;
        justify-content: flex-start;
      }

      .component-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .nav-button .nav-text {
        display: none;
      }
    }
  `]
})
export class HostComponent implements OnInit, OnDestroy {
  components: ComponentConfig[] = [];
  currentComponent: ComponentConfig | null = null;
  currentIndex: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private navigationService: NavigationService,
    private centralDataService: CentralDataService
  ) {}

  ngOnInit(): void {
    console.log('Host component initialized');

    // Register all components with the navigation service
    this.navigationService.registerComponents([
      {
        name: 'Dashboard',
        component: DashboardComponent,
        icon: '📊',
        description: 'View dashboard metrics and statistics'
      },
      {
        name: 'Profile',
        component: ProfileComponent,
        icon: '👤',
        description: 'Manage your profile information'
      },
      {
        name: 'Settings',
        component: SettingsComponent,
        icon: '⚙️',
        description: 'Configure application settings'
      },
      {
        name: 'Analytics',
        component: AnalyticsComponent,
        icon: '📈',
        description: 'View analytics and insights'
      }
    ]);

    // Get the list of components
    this.components = this.navigationService.getComponents();

    // Subscribe to current component changes
    this.navigationService.currentComponent$
      .pipe(takeUntil(this.destroy$))
      .subscribe(component => {
        this.currentComponent = component;
        console.log('Current component changed to:', component?.name);
      });

    // Subscribe to current index changes
    this.navigationService.currentIndex$
      .pipe(takeUntil(this.destroy$))
      .subscribe(index => {
        this.currentIndex = index;
        console.log('Current index changed to:', index);
      });
  }

  ngOnDestroy(): void {
    console.log('Host component destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToIndex(index: number): void {
    this.navigationService.navigateTo(index);
  }

  next(): void {
    this.navigationService.next();
  }

  previous(): void {
    this.navigationService.previous();
  }

  getIcon(name: string): string {
    const icons: { [key: string]: string } = {
      'Dashboard': '📊',
      'Profile': '👤',
      'Settings': '⚙️',
      'Analytics': '📈'
    };
    return icons[name] || '📄';
  }
}
