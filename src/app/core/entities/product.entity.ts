// DTO que representa la respuesta del backend para la lista de productos
export interface ProductListResponseDTO {
  // Array de productos devueltos en la respuesta
  data: ProductEntity[];
}

// Entidad que representa un producto individual
export interface ProductEntity {
  // Identificador único del producto
  id: string;

  // Nombre del producto
  name: string;

  // Descripción breve o detallada del producto
  description: string;

  // URL o base64 del logo del producto
  logo: string;

  // Fecha en la que el producto fue lanzado
  date_release: Date;

  // Fecha en la que se revisará o actualizará el producto
  date_revision: Date;
}
