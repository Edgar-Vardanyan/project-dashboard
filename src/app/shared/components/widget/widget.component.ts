import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  registerables,
  ChartTypeRegistry,
} from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Project } from '../../interfaces/project.interface';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ProjectService } from '../../../core/services/project.service';

Chart.register(...registerables);

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [DragDropModule, MatIconModule, MatDialogModule],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss',
})
export class WidgetComponent implements OnInit, AfterViewInit, OnDestroy {
  private dialog = inject(MatDialog);
  private projectService = inject(ProjectService);

  @Input() project!: Project;
  @ViewChild('pieChart') pieChartRef!: ElementRef;
  @ViewChild('widgetContainer', { static: true }) widgetContainer!: ElementRef;

  public pieChart!: Chart<keyof ChartTypeRegistry>;
  private pieChartOptions!: ChartConfiguration;
  private resizeObserver!: ResizeObserver;

  constructor() {}

  ngOnInit(): void {
    this.pieChartOptions = {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [this.project.tasksCompleted, this.getRemainingTasks()],
            backgroundColor: ['rgb(0, 128, 0)', 'rgb(240,128,128)'],
          },
        ],
        labels: ['Completed Tasks', 'Remaning Tasks'],
      },
    };

    this.applySavedDimensions();
    this.initResizeObserver();
  }

  ngAfterViewInit(): void {
    this.chartInit();
  }

  onResizeEnd(): void {
    const width = this.widgetContainer.nativeElement.offsetWidth;
    const height = this.widgetContainer.nativeElement.offsetHeight;

    this.projectService.updateWidgetSize(this.project.id, width, height);
  }

  initResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const width = this.widgetContainer.nativeElement.offsetWidth;
        const height = this.widgetContainer.nativeElement.offsetHeight;
        this.projectService.updateWidgetSize(this.project.id, width, height);
      }
    });

    if (this.widgetContainer) {
      this.resizeObserver.observe(this.widgetContainer.nativeElement);
    }
  }

  applySavedDimensions(): void {
    const savedSize = this.projectService.getWidgetSize(this.project.id);
    if (savedSize) {
      this.widgetContainer.nativeElement.style.width = `${savedSize.width}px`;
      this.widgetContainer.nativeElement.style.height = `${savedSize.height}px`;
    }
  }

  getRemainingTasks(): number {
    return this.project.tasksTotal - this.project.tasksCompleted;
  }

  onWidgetDelete(projectId: number): void {
    const dialogref = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
    });

    dialogref.afterClosed().subscribe((result: boolean) => {
      if(result) {
        this.projectService.removeWidget(projectId);
      }
    })
  }

  private chartInit(): void {
    const ctx = this.pieChartRef.nativeElement;

    this.pieChart = new Chart(ctx, this.pieChartOptions);
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
