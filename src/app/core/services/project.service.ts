import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Widget } from '../../shared/interfaces/widget.interface';
import { Project } from '../../shared/interfaces/project.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private storageKey = 'widgets';
  private widgetSizeKey = 'widget-sizes';
  private widgetsSubject$ = new BehaviorSubject<Widget[]>(this.loadWidgetsFromStorage());
  public widgets$ = this.widgetsSubject$.asObservable();

  constructor() {
    if(!this.loadWidgetsFromStorage().length) {
      this.widgetsSubject$.next(
        [
          {
            type: 'pie',
            project: {
              id: 1,
            name: 'Project A',
            tasksCompleted: 25,
            tasksTotal: 100,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            }
          },
          {
            type: 'pie',
            project: {
              id: 2,
              name: 'Project B',
              tasksCompleted: 75,
              tasksTotal: 140,
              startDate: '2023-06-01',
              endDate: '2024-03-31',
            }
          },
          {
            type: 'pie',
            project: {
              id: 3,
              name: 'Project C',
              tasksCompleted: 80,
              tasksTotal: 85,
              startDate: '2024-06-01',
              endDate: '2024-09-30',
            }
          },
        ]
      )
    }
  }

  getWidgets(): Observable<Widget[]> {
    return this.widgets$;
  }

  addWidget(widget: Project): void {
    const currentWidgets = this.widgetsSubject$.value;
    currentWidgets.push({
      type: 'pie',
      project: widget
    });
    this.saveWidgetsToStorage(currentWidgets);
    this.widgetsSubject$.next(currentWidgets);
  }

  removeWidget(widgetId: number): void {
    const updatedWidgets = this.widgetsSubject$.value.filter(widget => widget.project.id !== widgetId);
    this.saveWidgetsToStorage(updatedWidgets);
    this.widgetsSubject$.next(updatedWidgets);
  }

  reorderWidgets(widgets: Widget[]): void {
    this.saveWidgetsToStorage(widgets);
    this.widgetsSubject$.next(widgets);
  }

  updateWidgetSize(widgetId: number, width: number, height: number): void {
    const widgetSizes = this.loadWidgetSizes();
    widgetSizes[widgetId] = { width, height };
    this.saveWidgetSizes(widgetSizes);
  }

  getWidgetSize(widgetId: number): { width: number; height: number } | null {
    const widgetSizes = this.loadWidgetSizes();
    return widgetSizes[widgetId] || null;
  }

  private saveWidgetSizes(sizes: any): void {
    localStorage.setItem(this.widgetSizeKey, JSON.stringify(sizes));
  }

  private loadWidgetSizes(): any {
    const sizesFromStorage = localStorage.getItem(this.widgetSizeKey);
    return sizesFromStorage ? JSON.parse(sizesFromStorage) : {};
  }

  private saveWidgetsToStorage(widgets: Widget[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(widgets));
  }

  private loadWidgetsFromStorage(): Widget[] {
    const widgetsFromStorage = localStorage.getItem(this.storageKey);
    return widgetsFromStorage ? JSON.parse(widgetsFromStorage) : [];
  }

  checkNameAvailability(name: string): Observable<boolean> {
    const isAvailable = !this.widgetsSubject$.value.some((widget) => widget.project.name.toLowerCase() === name.toLowerCase());
    return of(isAvailable);
  }
}
