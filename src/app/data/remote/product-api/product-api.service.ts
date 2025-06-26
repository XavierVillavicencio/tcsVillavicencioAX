// infrastructure/product-api/product-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, firstValueFrom, lastValueFrom, map, of, retry, switchMap, take, throwError } from 'rxjs';
import { ProductRepository } from '../../../core/interfaces/product.repository'; // Path to the ProductRepository interface
import { ProductModel } from '../../../core/models/product.model'; // Path to the ProductModel
import { mapProductFromDTO } from './product.mapper';
import { ProductListResponseDTO } from '../../../core/entities/product.entity';

/**
 * @file ProductApiService
 * @description
 * This service acts as a **Driven Adapter** (or Secondary Adapter) for the `ProductRepository` interface.
 * Its responsibility is to provide a concrete implementation for interacting with a
 * remote product API, typically via HTTP requests.
 *
 * It resides in the **Infrastructure Layer** because it deals with external concerns
 * (like network communication and API protocols). It knows about `HttpClient`
 * (an Angular-specific tool) and the API's endpoint, but it hides these details
 * from the `ProductRepository` interface and the application's business logic.
 *
 * By implementing `ProductRepository`, it fulfills the contract defined by the
 * domain, allowing the application layer to remain decoupled from the data source's
 * specific technology.
 */
@Injectable({ providedIn: 'root' })
export class ProductApiService implements ProductRepository {
  private readonly baseUrl = '/bp/products';
  /**
   * Constructs an instance of ProductApiService.
   *
   * @param {HttpClient} http - Angular's HttpClient service, used for making HTTP requests.
   * This is an infrastructure-specific dependency that this adapter uses to
   * fulfill the `ProductRepository` contract.
   */
  constructor(private http: HttpClient) {}

  /**
   * Implements the `getAll` method from the `ProductRepository` interface.
   * Fetches all product data from a specified API endpoint.
   *
   * @returns {Promise<ProductModel[]>} A Promise that resolves with an array of `ProductModel` objects.
   * It converts the HttpClient's Observable to a Promise, as defined by the repository interface.
   */
  getAll(): Observable<ProductModel[]> {
    return this.http.get<ProductListResponseDTO>(this.baseUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      observe: 'response',
      responseType: 'json',
    }).pipe(
      map(response => response.body?.data.map(mapProductFromDTO) ?? [])
    );
  }
  
  create(product: ProductModel): Observable<void> {
    return this.http.post<void>(this.baseUrl, product, {
      headers: {
        'Content-Type': 'application/json',
      },
      observe: 'response',
      responseType: 'json'
    }).pipe(
      map(() => void 0)
    );
  }
  

  update(product: ProductModel): Observable<void> {
    console.info('llegamos por aqui');
    return this.http.put<{ data: ProductModel }>(`${this.baseUrl}/${product.id}`, product, {
      headers: {
        'Content-Type': 'application/json',
      },
      observe: 'response',
      responseType: 'json',
    }).pipe(
      map(response => {
        const updatedProduct = mapProductFromDTO(response.body?.data);
        console.info('Producto actualizado:', updatedProduct);
        return void 0; // Porque el método declara Observable<void>
      })
    );
  }
  

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  verify(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}