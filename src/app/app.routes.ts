import { Routes } from '@angular/router';
import { ProductListComponent } from './presentation/products/product-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', children: [
    { path: '', component: ProductListComponent }
  ]}
];
