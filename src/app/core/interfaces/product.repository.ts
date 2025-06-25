import { Observable } from 'rxjs';
import { ProductModel } from '../models/product.model'; // Corrected import path for consistency (assuming product.model.ts)

/**
 * @file ProductRepository
 * @description
 * Defines the contract (port) for interacting with product data.
 * This interface specifies the operations that the application layer (use cases)
 * needs from the infrastructure layer (data persistence, e.g., API, database).
 * It completely decouples the business logic from the specific data storage technology.
 *
 * In a hexagonal architecture, this is a **Driven Port** (or Secondary Port).
 * The application core depends on this interface, but not on its concrete implementation.
 */
export interface ProductRepository {
  /**
   * Retrieves all product records.
   * @returns {Promise<ProductModel[]>} A promise that resolves with an array of ProductModel objects.
   */
  getAll(): Promise<ProductModel[]>;
  create(product: ProductModel): Promise<void>;
  update(product: ProductModel): Observable<void>;
  delete(id: string): Observable<void>;
  generateUniqueProductId(): Observable<number>;
}