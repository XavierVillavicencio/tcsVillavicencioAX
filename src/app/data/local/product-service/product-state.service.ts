import { Injectable } from '@angular/core';
import { ProductModel } from '../../../core/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductStateService {
  private selectedProduct: ProductModel | null = null;

  set(product: ProductModel) {
    this.selectedProduct = product;
  }

  get(): ProductModel | null {
    return this.selectedProduct;
  }

  clear() {
    this.selectedProduct = null;
  }
}
