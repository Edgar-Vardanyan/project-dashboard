import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function tasksCompletedValidator(getTasksTotalControl: () => AbstractControl | null): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const tasksCompleted = control.value;
      const tasksTotalControl = getTasksTotalControl();
      const tasksTotal = tasksTotalControl?.value;
  
      if (tasksTotal == null || tasksCompleted == null) {
        return null;
      }
  
      return tasksCompleted > tasksTotal ? { tasksCompletedExceeds: true } : null;
    };
  }