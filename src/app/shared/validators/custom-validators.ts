import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function todayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (!valor) return null;

    const inputDate = new Date(valor + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inputDate >= today ? null : { fechaPasada: true };
  };
}
