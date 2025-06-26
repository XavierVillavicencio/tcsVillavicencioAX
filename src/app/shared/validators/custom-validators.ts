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

export function urlValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();
      if (!value) return null;
      try {
        new URL(value); // Esto lanza error si no es URL válida
        return null;
      } catch (_) {
        return { invalidUrl: true };
      }
    };
  }