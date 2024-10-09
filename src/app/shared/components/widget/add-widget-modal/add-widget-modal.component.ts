import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { generateNumericId } from '../../../util/generate-id';
import { Project } from '../../../interfaces/project.interface';
import { ProjectService } from '../../../../core/services/project.service';
import { DatePipe } from '@angular/common';
import { tasksCompletedValidator } from './validators/tasks-count.validator';

@Component({
  selector: 'app-add-widget-modal',
  standalone: true,
  providers: [provideNativeDateAdapter(), DatePipe],
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-widget-modal.component.html',
  styleUrl: './add-widget-modal.component.scss',
})
export class AddWidgetModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private datePipe = inject(DatePipe);
  
  newWidgetForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddWidgetModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project
  ) {
    this.newWidgetForm = this.fb.group({
      id: [generateNumericId()],
      name: ['', [Validators.required]],
      tasksTotal: ['', [Validators.required]],
      tasksCompleted: ['', [Validators.required]],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.newWidgetForm.get('tasksCompleted')?.setValidators([
      Validators.required,
      tasksCompletedValidator(() => this.newWidgetForm.get('tasksTotal'))
    ]);

    this.newWidgetForm.get('tasksCompleted')?.updateValueAndValidity();
  }

  checkNameAvailability() {
    const projectName = this.newWidgetForm.get('name')?.value;
    this.projectService.checkNameAvailability(projectName).subscribe((isAvailable) => {
      if (!isAvailable) {
        this.newWidgetForm.get('name')?.setErrors({
          duplicate: true
        })
      } else {
        this.newWidgetForm.get('name')?.setErrors(null);
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    const startDate = this.newWidgetForm.get('startDate')?.value;
    const endDate = this.newWidgetForm.get('endDate')?.value;
  
    const formattedStartDate = this.datePipe.transform(startDate, 'yyyy-MM-dd');
    const formattedEndDate = this.datePipe.transform(endDate, 'yyyy-MM-dd');
  
    const updatedFormValue = {
      ...this.newWidgetForm.value,
      startDate: formattedStartDate,
      endDate: formattedEndDate
    };
    this.dialogRef.close(updatedFormValue);
  }
}
