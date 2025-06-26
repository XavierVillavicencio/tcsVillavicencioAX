import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductModel } from '../../../core/models/product.model';
import { ProductApiService } from '../../../data/remote/product-api/product-api.service';
import { Observable, map } from 'rxjs';
import { todayValidator, urlValidator } from '../../../shared/validators/custom-validators';
import { CreateProductUseCase } from '../../../core/use-cases/create-product.usecase';
import { UpdateProductUseCase } from '../../../core/use-cases/update-product.usecase';

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
  private createProductUseCase: CreateProductUseCase;
  private updateProductUseCase: UpdateProductUseCase;
  form!: FormGroup;
  editId: string = '';

  constructor(
    private fb: FormBuilder,
    private productApi: ProductApiService
  ) {
    this.updateProductUseCase = new UpdateProductUseCase(this.productApi);
    this.createProductUseCase = new CreateProductUseCase(this.productApi);
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)
        ],
        [this.ValidatorId()]
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', [Validators.required, urlValidator()]],
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
      this.validateRevisionDate();
    });

    if (this.product) {
      const patch = {
        ...this.product,
        date_release: this.formatDate(this.product.date_release),
        date_revision: this.formatDate(this.product.date_revision)
      };
      this.form.patchValue(patch);
      this.editId = this.product.id;
      this.form.get('id')?.disable();
    }
    
  }
  
  formatDate(date: Date): string {
    const local = new Date(date);
    const year = local.getFullYear();
    const month = String(local.getMonth() + 1).padStart(2, '0');
    const day = String(local.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }  
  
  validateRevisionDate(): void {
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
  

  ValidatorId(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.productApi.verify(control.value).pipe(
        map((exists: boolean) => (exists ? { idDuplicado: true } : null))
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
      product.id = this.editId;
      this.updateProductUseCase.execute(product).subscribe(() => {
        console.info('se actualizo el producto');
      });
    } else {
      this.createProductUseCase.execute(product).subscribe(() => {
        console.info('se almaceno el producto');
      });
    }

    this.submitted.emit();
  }
}
