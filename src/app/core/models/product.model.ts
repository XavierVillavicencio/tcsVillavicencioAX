// Modelo de dominio que representa un producto en el frontend
export class ProductModel {
  // Constructor con las propiedades necesarias del producto
  constructor(
    public id: string,              // ID único del producto
    public name: string,            // Nombre del producto
    public description: string,     // Descripción del producto
    public logo: string,            // URL o base64 del logo
    public date_release: Date,      // Fecha de lanzamiento
    public date_revision: Date      // Fecha de próxima revisión
  ) {}

  /**
   * Método de fábrica para transformar un objeto plano (DTO)
   * en una instancia de ProductModel.
   * Útil cuando el backend devuelve strings para las fechas.
   */
  static fromDTO(dto: any): ProductModel {
    return new ProductModel(
      dto.id,
      dto.name,
      dto.description,
      dto.logo,
      new Date(dto.date_release),   // Convierte a objeto Date
      new Date(dto.date_revision)
    );
  }
}
