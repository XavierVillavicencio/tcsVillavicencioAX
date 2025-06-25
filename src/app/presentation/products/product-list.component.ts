// ui/pages/products/product-list.component.ts
import { Component, OnInit } from '@angular/core';
import { GetAllProducts } from '../../core/use-cases/get-all-products';
import { DeleteProductUseCase } from '../../core/use-cases/delete-product.usecase';
import { ProductApiService } from '../../data/remote/product-api/product-api.service';
import { ProductModel } from '../../core/models/product.model';
import { ProductStateService } from '../../data/local/product-service/product-state.service'
import { RouterLink  } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfirmDeleteModalComponent } from './modal/confirm-delete-modal.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [ConfirmDeleteModalComponent, CommonModule, ReactiveFormsModule, RouterLink ],
})
export class ProductListComponent implements OnInit {
  products:ProductModel[] = [];
  private getAllProducts: GetAllProducts;
  private deleteProductUseCase: DeleteProductUseCase;
  confirmingProduct: ProductModel | null = null;

  constructor(
        private productApi: ProductApiService, 
        private router: Router,
        private productStateService: ProductStateService
  ) {
    this.getAllProducts = new GetAllProducts(this.productApi);
    this.deleteProductUseCase = new DeleteProductUseCase(this.productApi);
  }

  ngOnInit() {
    this.getAllProducts.execute().then(p => this.products = p);
  }

  goToEdit(product: ProductModel): void {
    this.productStateService.set(product);
    this.router.navigate(['/products/edit', product.id]);
  }  

  onDeleteClick(product: ProductModel): void {
    this.confirmingProduct = product;
  }

  onConfirmDelete(confirmed: boolean): void {
    if (confirmed && this.confirmingProduct) {
      const id = this.confirmingProduct.id;
      this.deleteProductUseCase.execute(id).subscribe(() => {
        this.products = this.products.filter(p => p.id !== id);
        console.log(`✅ Producto ${this.confirmingProduct?.name} eliminado`);
      });
    }
    this.confirmingProduct = null; // cerrar modal
  }
}
