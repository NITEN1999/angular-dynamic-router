import { Component } from '@angular/core';
import { HostComponent } from './components/host/host.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HostComponent],
  template: '<app-host></app-host>',
  styles: []
})
export class AppComponent {
  title = 'angular-dynamic-router';
}
