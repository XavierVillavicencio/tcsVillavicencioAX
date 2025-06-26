import { FormControl } from '@angular/forms';
import { todayValidator } from './custom-validators';

describe('todayValidator', () => {
  const validator = todayValidator();

  it('debería permitir la fecha de hoy', () => {
    const hoy = new Date().toISOString().split('T')[0];
    const control = new FormControl(hoy);
    expect(validator(control)).toBeNull();
  });

  it('debería permitir una fecha futura', () => {
    const futura = new Date();
    futura.setDate(futura.getDate() + 5);
    const futuraStr = futura.toISOString().split('T')[0];

    const control = new FormControl(futuraStr);
    expect(validator(control)).toBeNull();
  });

  it('debería rechazar una fecha pasada', () => {
    const pasadaStr = '2023-01-01'; // Fecha claramente pasada
    const control = new FormControl(pasadaStr);
    expect(validator(control)).toEqual({ fechaPasada: true });

  });

  it('debería permitir null (por si se combina con required)', () => {
    const control = new FormControl(null);
    expect(validator(control)).toBeNull();
  });
});
