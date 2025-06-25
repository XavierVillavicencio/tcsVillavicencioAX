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
  async getAll(): Promise<ProductModel[]> {
    const response = await firstValueFrom(this.http.get<ProductListResponseDTO>(this.baseUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      observe: 'response',
      responseType: 'json',
    }));
    const model = response.body?.data.map(mapProductFromDTO);
    console.debug({ model });
    return model ?? [];
  }

  async create(product: ProductModel): Promise<void> {
    const id = await firstValueFrom(this.generateUniqueProductId());
    product.id = id.toString();
    const response = await firstValueFrom(
      this.http.post<void>(this.baseUrl, product, {
        headers: {
          'Content-Type': 'application/json',
        },
        observe: 'response',
        responseType: 'json'
      })
    );
    
    // Si quieres inspeccionar el status o headers
    console.debug('Status:', response.status);
    console.debug('Headers:', response.headers);
    
    return; // o response.body si esperas algo    
  }

  update(product: ProductModel): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${product.id}`, product);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  generateUniqueProductId(): Observable<number> {
    return of(null).pipe(
      map(() => Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000),
      switchMap((newId) =>
        this.http.get<void>(`${this.baseUrl}/verification/${newId}`, {}).pipe(
          map(() => {
            console.log(`✅ ID único encontrado: ${newId}`);
            return newId;
          }),
          catchError((error) => {
            if (error.status === 409) {
              console.warn(`🚫 ID ${newId} ya existe. Intentando otro...`);
              return throwError(() => new Error('ID exists'));
            } else {
              console.error(`💥 Error al verificar ID ${newId}:`, error);
              return throwError(() => error);
            }
          })
        )
      ),
      retry({ delay: 100 }), // reintenta con un pequeño delay
      take(1) // salimos al primer ID válido
    );
  }
  

}