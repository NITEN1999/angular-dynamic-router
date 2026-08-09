import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CentralDataService, ProfileData } from '../../services/central-data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  data: ProfileData = {
    name: '',
    email: '',
    role: '',
    avatar: '',
    bio: ''
  };
  private destroy$ = new Subject<void>();

  constructor(private centralDataService: CentralDataService) {}

  ngOnInit(): void {
    console.log('Profile component initialized');
    this.centralDataService.profileData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.data = { ...data };
        console.log('Profile received data update:', data);
      });
  }

  ngOnDestroy(): void {
    console.log('Profile component destroyed');
    this.destroy$.next();
    this.destroy$.complete();
  }

  saveProfile(): void {
    this.centralDataService.updateProfileData(this.data);
    alert('Profile saved successfully!');
  }

  resetProfile(): void {
    this.centralDataService.profileData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.data = { ...data };
      });
  }
}
