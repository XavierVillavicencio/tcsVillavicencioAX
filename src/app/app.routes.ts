import { Routes } from '@angular/router';
import { ProductListComponent } from './presentation/products/product-list.component';
import { ProductFormComponent } from './presentation/products/form/product-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', children: [
    { path: '', component: ProductListComponent },
    { path: 'create', component: ProductFormComponent },
    { path: 'edit/:id', component: ProductFormComponent }
  ]}
];
