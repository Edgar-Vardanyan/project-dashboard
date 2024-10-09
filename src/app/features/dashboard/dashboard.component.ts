import { Component, DestroyRef, inject } from '@angular/core';
import { WidgetComponent } from '../../shared/components/widget/widget.component';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../shared/interfaces/project.interface';
import { Widget } from '../../shared/interfaces/widget.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { AddWidgetModalComponent } from '../../shared/components/widget/add-widget-modal/add-widget-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    WidgetComponent,
    DragDropModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private destroyRef = inject(DestroyRef);
  private projectService = inject(ProjectService);
  private dialog = inject(MatDialog);

  public widgets: Widget[] = [];

  constructor() {
    this.projectService
      .getWidgets()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.widgets = data;
      });
  }

  openNewProjectModal(): void {
    const dialogRef = this.dialog.open(AddWidgetModalComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.projectService.addWidget(result);
      }
    });
  }

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      moveItemInArray(this.widgets, event.previousIndex, event.currentIndex);
      this.projectService.reorderWidgets(this.widgets);
    }
  }
}
