import { Injectable, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ComponentConfig {
  name: string;
  component: Type<any>;
  icon?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private componentsRegistry: ComponentConfig[] = [];
  private currentIndexSubject = new BehaviorSubject<number>(0);
  private currentComponentSubject = new BehaviorSubject<ComponentConfig | null>(null);

  public currentIndex$: Observable<number> = this.currentIndexSubject.asObservable();
  public currentComponent$: Observable<ComponentConfig | null> = this.currentComponentSubject.asObservable();

  constructor() {
    console.log('NavigationService initialized');
  }

  // Register components array
  registerComponents(components: ComponentConfig[]): void {
    this.componentsRegistry = components;
    if (components.length > 0) {
      this.currentComponentSubject.next(components[0]);
      this.currentIndexSubject.next(0);
    }
    console.log('Components registered:', components.length);
  }

  // Get all registered components
  getComponents(): ComponentConfig[] {
    return this.componentsRegistry;
  }

  // Navigate to component by index
  navigateTo(index: number): void {
    if (index >= 0 && index < this.componentsRegistry.length) {
      this.currentIndexSubject.next(index);
      this.currentComponentSubject.next(this.componentsRegistry[index]);
      console.log(`Navigated to component: ${this.componentsRegistry[index].name} (index: ${index})`);
    } else {
      console.warn(`Invalid navigation index: ${index}`);
    }
  }

  // Navigate to component by name
  navigateToComponent(name: string): void {
    const index = this.componentsRegistry.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
    if (index !== -1) {
      this.navigateTo(index);
    } else {
      console.warn(`Component not found: ${name}`);
    }
  }

  // Navigate to next component
  next(): void {
    const currentIndex = this.currentIndexSubject.value;
    const nextIndex = (currentIndex + 1) % this.componentsRegistry.length;
    this.navigateTo(nextIndex);
  }

  // Navigate to previous component
  previous(): void {
    const currentIndex = this.currentIndexSubject.value;
    const prevIndex = currentIndex === 0 
      ? this.componentsRegistry.length - 1 
      : currentIndex - 1;
    this.navigateTo(prevIndex);
  }

  // Get current component
  getCurrentComponent(): ComponentConfig | null {
    return this.currentComponentSubject.value;
  }

  // Get current index
  getCurrentIndex(): number {
    return this.currentIndexSubject.value;
  }

  // Check if can go next
  canGoNext(): boolean {
    return this.componentsRegistry.length > 0;
  }

  // Check if can go previous
  canGoPrevious(): boolean {
    return this.componentsRegistry.length > 0;
  }

  // Get component at index
  getComponentAt(index: number): ComponentConfig | null {
    if (index >= 0 && index < this.componentsRegistry.length) {
      return this.componentsRegistry[index];
    }
    return null;
  }

  // Get total component count
  getComponentCount(): number {
    return this.componentsRegistry.length;
  }
}
