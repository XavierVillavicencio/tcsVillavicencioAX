import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModel } from '../../../core/models/product.model';
import { ProductApiService } from '../../../data/remote/product-api/product-api.service';
import { ProductStateService } from '../../../data/local/product-service/product-state.service'
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  editing = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productApi: ProductApiService,
    private productStateService: ProductStateService
  ) {
    this.form = this.fb.group({
        id: [''],  // opcional si lo maneja el backend
        name: ['', Validators.required],
        description: ['', Validators.required],
        logo: ['', Validators.required],
        date_release: [null, Validators.required],
        date_revision: [null, Validators.required]
      });
      
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editing = true;
      const product = this.productStateService.get();
  
      if (product && id === product.id.toString()) {
        this.productId = product.id;
        this.form.patchValue(product);
      } else {
        alert('No se encontró el producto. Vuelve a la lista.');
        this.router.navigate(['/products']);
      }
    }
  }  

  async onSubmit() {
    if (this.form.invalid) return;

    const product: ProductModel = {
      id: this.productId ?? 0,
      ...this.form.value
    };

    if (this.editing) {
      await this.productApi.update(product);
    } else {
      await this.productApi.create(product);
    }

    this.router.navigate(['/products']);
  }
}
