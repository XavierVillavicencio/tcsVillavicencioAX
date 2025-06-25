export class ProductModel {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public logo: string,
    public date_release: Date,
    public date_revision: Date
  ) {}

  static fromDTO(dto: any): ProductModel {
    return new ProductModel(
      dto.id,
      dto.name,
      dto.description,
      dto.logo,
      new Date(dto.date_release),
      new Date(dto.date_revision)
    );
  }
}
