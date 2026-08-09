import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CentralDataService, SettingsData } from '../../services/central-data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="component-container">
      <div class="header">
        <h2>Settings</h2>
        <p class="subtitle">Customize your application preferences</p>
      </div>

      <div class="settings-grid">
        <!-- Theme Settings -->
        <div class="settings-card">
          <h3>Appearance</h3>
          <div class="setting-item">
            <div class="setting-info">
              <label>Theme</label>
              <p>Choose your preferred color scheme</p>
            </div>
            <select [(ngModel)]="data.theme" class="form-select">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <label>Language</label>
              <p>Select your language</p>
            </div>
            <select [(ngModel)]="data.language" class="form-select">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="settings-card">
          <h3>Notifications</h3>
          <div class="setting-item">
            <div class="setting-info">
              <label>Email Notifications</label>
              <p>Receive updates via email</p>
            </div>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="data.notifications.email">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <label>Push Notifications</label>
              <p>Receive push notifications</p>
            </div>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="data.notifications.push">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <label>SMS Notifications</label>
              <p>Receive text messages</p>
            </div>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="data.notifications.sms">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- Privacy Settings -->
        <div class="settings-card">
          <h3>Privacy</h3>
          <div class="setting-item">
            <div class="setting-info">
              <label>Profile Visibility</label>
              <p>Make your profile visible to others</p>
            </div>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="data.privacy.profileVisible">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <label>Show Email</label>
              <p>Display email on your profile</p>
            </div>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="data.privacy.showEmail">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <div class="setting-info">
              <label>Show Location</label>
              <p>Display location on your profile</p>
            </div>
            <label class="toggle">
              <input type="checkbox" [(ngModel)]="data.privacy.showLocation">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- Regional Settings -->
        <div class="settings-card">
          <h3>Regional</h3>
          <div class="setting-item">
            <div class="setting-info">
              <label>Timezone</label>
              <p>Your current timezone</p>
            </div>
            <select [(ngModel)]="data.timezone" class="form-select">
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC+0">GMT (UTC+0)</option>
              <option value="UTC+1">Central European (UTC+1)</option>
              <option value="UTC+5:30">India (UTC+5:30)</option>
            </select>
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-primary" (click)="saveSettings()">Save Settings</button>
        <button class="btn btn-secondary" (click)="resetSettings()">Reset to Defaults</button>
      </div>
    </div>
  `,
  styles: [`
    .component-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 2rem;
    }

    .header h2 {
      margin: 0;
      color: #333;
      font-size: 2rem;
    }

    .subtitle {
      color: #666;
      margin: 0.5rem 0 0 0;
    }

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .settings-card {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .settings-card h3 {
      margin: 0 0 1.5rem 0;
      color: #333;
      font-size: 1.25rem;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .setting-info {
      flex: 1;
    }

    .setting-info label {
      display: block;
      color: #333;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .setting-info p {
      margin: 0;
      color: #999;
      font-size: 0.85rem;
    }

    .form-select {
      padding: 0.5rem;
      border: 2px solid #e0e0e0;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
    }

    .form-select:focus {
      outline: none;
      border-color: #667eea;
    }

    /* Toggle Switch */
    .toggle {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 26px;
    }

    .toggle input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: 0.3s;
      border-radius: 26px;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }

    .toggle input:checked + .toggle-slider {
      background-color: #667eea;
    }

    .toggle input:checked + .toggle-slider:before {
      transform: translateX(24px);
    }

    .actions {
      display: flex;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }
  `]
})
export class SettingsComponent implements OnInit, OnDestroy {
  data: SettingsData = {
    theme: 'light',
    notifications: { email: true, push: false, sms: true },
    privacy: { profileVisible: true, showEmail: false, showLocation: true },
    language: 'en',
    timezone: 'UTC-8'
  };
  private destroy$ = new Subject<void>();

  constructor(private centralDataService: CentralDataService) {}

  ngOnInit(): void {
    console.log('Settings component initialized');
    this.centralDataService.settingsData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.data = { ...data };
        console.log('Settings received data update:', data);
      });
  }

  ngOnDestroy(): void {
    console.log('Settings component destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveSettings(): void {
    this.centralDataService.updateSettingsData(this.data);
    alert('Settings saved successfully!');
  }

  resetSettings(): void {
    this.centralDataService.updateSettingsData({
      theme: 'light',
      notifications: { email: true, push: false, sms: true },
      privacy: { profileVisible: true, showEmail: false, showLocation: true },
      language: 'en',
      timezone: 'UTC-8'
    });
  }
}
