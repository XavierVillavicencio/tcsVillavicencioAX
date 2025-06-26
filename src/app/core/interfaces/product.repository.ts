import { Observable } from 'rxjs';
import { ProductModel } from '../models/product.model';

export interface ProductRepository {
  /**
   * Obtiene todos los productos registrados en el sistema.
   * Se espera que los datos provengan de una fuente externa (API, DB, etc.).
   * 
   * @returns Observable con un array de productos.
   */
  getAll(): Observable<ProductModel[]>;

  /**
   * Crea un nuevo producto en la fuente de datos.
   * No retorna ningún valor, pero su éxito o error se controla por el Observable.
   * 
   * @param product - Objeto con los datos del producto a registrar.
   */
  create(product: ProductModel): Observable<void>;

  /**
   * Actualiza la información de un producto existente.
   * Se espera que el producto contenga su identificador.
   * 
   * @param product - Producto modificado a persistir.
   */
  update(product: ProductModel): Observable<void>;

  /**
   * Elimina un producto según su ID.
   * Ideal para operaciones de mantenimiento o gestión.
   * 
   * @param id - Identificador único del producto a eliminar.
   */
  delete(id: string): Observable<void>;

  /**
   * Verifica si un producto con el ID proporcionado existe o cumple cierta condición.
   * Puede servir como validación previa a otras operaciones.
   * 
   * @param id - Identificador del producto a verificar.
   * @returns Observable con un booleano indicando el resultado de la verificación.
   */
  verify(id: string): Observable<boolean>;
}
