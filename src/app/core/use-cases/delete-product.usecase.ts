// src/app/core/use-cases/delete-product.usecase.ts
import { Observable } from 'rxjs';
import { ProductApiService } from '../../data/remote/product-api/product-api.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DeleteProductUseCase {
    constructor(private readonly productApi: ProductApiService) {}
    execute(id: string): Observable<void> {
        return this.productApi.delete(id);
      }      
  }
