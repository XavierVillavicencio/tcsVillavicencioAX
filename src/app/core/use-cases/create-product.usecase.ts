// src/app/core/use-cases/delete-product.usecase.ts
import { Observable } from 'rxjs';
import { ProductApiService } from '../../data/remote/product-api/product-api.service';
import { Injectable } from '@angular/core';
import { ProductModel } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CreateProductUseCase {
    constructor(private readonly productApi: ProductApiService) {}
    execute(product: ProductModel): Observable<void> {
        return this.productApi.create(product);
      }      
  }
