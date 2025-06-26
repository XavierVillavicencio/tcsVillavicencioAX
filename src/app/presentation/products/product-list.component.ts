import { Component, HostListener, OnInit } from '@angular/core';
import { GetAllProducts } from '../../core/use-cases/get-all-products';
import { DeleteProductUseCase } from '../../core/use-cases/delete-product.usecase';
import { ProductApiService } from '../../data/remote/product-api/product-api.service';
import { ProductModel } from '../../core/models/product.model';
import { CommonModule } from '@angular/common';
import { ConfirmDeleteModalComponent } from './modal/confirm-delete-modal.component';
import { ProductFormModalComponent } from './form/product-form.component';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime, startWith, map } from 'rxjs/operators';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['../../app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ConfirmDeleteModalComponent,
    ProductFormModalComponent,
    FormsModule
  ]
})
export class ProductListComponent implements OnInit {
  products: ProductModel[] = [];
  confirmingProduct: ProductModel | null = null;
  editingProduct: ProductModel | null = null;
  showFormModal = false;
  searchControl = new FormControl('');
  filteredCount = 0;
  itemsPerPage = 5;
  openedMenuId: string | null = null;

  private products$ = new BehaviorSubject<ProductModel[]>([]);
  filteredProducts$!: Observable<ProductModel[]>;

  private getAllProducts: GetAllProducts;
  private deleteProductUseCase: DeleteProductUseCase;

  constructor(
    private productApi: ProductApiService
  ) {
    this.getAllProducts = new GetAllProducts(this.productApi);
    this.deleteProductUseCase = new DeleteProductUseCase(this.productApi);
  }

  ngOnInit() {
    this.loadProducts();
    this.filteredProducts$ = combineLatest([
  this.products$,
  this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300))
]).pipe(
  map(([products, term]) => {
    const lowerTerm = (term ?? '').toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(lowerTerm) ||
      product.description.toLowerCase().includes(lowerTerm)
    );
    this.filteredCount = filtered.length;
    return filtered;
  })
);  
  }

  loadProducts(): void {
    this.getAllProducts.execute().subscribe(products => {
      this.products$.next(products);
    });
  }
  

  // 🚀 CREAR PRODUCTO
  openCreateModal(): void {
    this.editingProduct = null;
    this.showFormModal = true;
  }

  openEditModal(product: ProductModel): void {
    this.editingProduct = product;
    this.showFormModal = true;
  }

  onFormSubmitted(): void {
    this.showFormModal = false;
    this.loadProducts();
  }

  onFormCancelled(): void {
    this.showFormModal = false;
  }

  onDeleteClick(product: ProductModel): void {
    this.confirmingProduct = product;
  }

  onConfirmDelete(confirmed: boolean): void {
    if (confirmed && this.confirmingProduct) {
      const id = this.confirmingProduct.id;
      this.deleteProductUseCase.execute(id).subscribe(() => {
        this.loadProducts();
      });
    }
    this.confirmingProduct = null;
  }

  toggleMenu(productId: string) {
    this.openedMenuId = this.openedMenuId === productId ? null : productId;
  }

  onMenuClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-menu-cell')) {
      this.openedMenuId = null;
    }
  }

  logoFallback(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.classList.add('fallback-logo');
  }
}
