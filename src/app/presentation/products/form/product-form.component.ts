import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductModel } from '../../../core/models/product.model';
import { ProductApiService } from '../../../data/remote/product-api/product-api.service';
import { Observable, map } from 'rxjs';
import { todayValidator } from '../../../shared/validators/custom-validators'

@Component({
  selector: 'app-product-form-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['../../../app.component.scss']
})
export class ProductFormModalComponent implements OnInit {
  @Input() product: ProductModel | null = null;
  @Output() submitted = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productApi: ProductApiService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)
        ],
        [this.idDisponibilidadValidator()]
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: [null, [Validators.required, todayValidator()]],
      date_revision: [null, [Validators.required]]
    });
    

    this.form.get('date_release')?.valueChanges.subscribe((fecha: string) => {
      if (!fecha) return;
  
      const fechaLib = new Date(fecha);
      const fechaRev = new Date(fechaLib);
      fechaRev.setFullYear(fechaLib.getFullYear() + 1);
  
      const formatted = fechaRev.toISOString().split('T')[0];
      this.form.get('date_revision')?.setValue(formatted);
      this.validarFechaRevision();
    });

    if (this.product) {
      this.form.patchValue(this.product);
    }
  }
  
  
  validarFechaRevision(): void {
    const lib = this.form.get('date_release')?.value;
    const rev = this.form.get('date_revision')?.value;
  
    if (!lib || !rev) return;
  
    const libDate = new Date(lib);
    const revDate = new Date(rev);
    const expectedRev = new Date(libDate);
    expectedRev.setFullYear(libDate.getFullYear() + 1);
  
    const isSameDate =
      revDate.toISOString().split('T')[0] === expectedRev.toISOString().split('T')[0];
  
    this.form.get('date_revision')?.setErrors(isSameDate ? null : { revisionIncorrecta: true });
  }
  

  idDisponibilidadValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.productApi.verify(control.value).pipe(
        map((existe: boolean) => (existe ? { idDuplicado: true } : null))
      );
    };
  }
  

  onCancel(): void {
    this.cancelled.emit();
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;
    console.info(this.form.value);
    const product: ProductModel = {
      ...this.form.value
    };

    if (this.product) {
      await this.productApi.update(product);
    } else {
      await this.productApi.create(product);
    }

    this.submitted.emit();
  }
}
