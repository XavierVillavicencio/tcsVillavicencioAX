// src/app/data/mappers/product.mapper.ts

import { ProductModel } from '../../../core/models/product.model';

export function mapProductFromDTO(dto: any): ProductModel {
  return new ProductModel(
    dto.id,
    dto.name,
    dto.description,
    dto.logo,
    new Date(dto.date_release),
    new Date(dto.date_revision)
  );
}

export function mapProductToDTO(model: ProductModel): any {
  return {
    id: model.id,
    name: model.name,
    description: model.description,
    logo: model.logo,
    date_release: model.date_release.toISOString(),
    date_revision: model.date_revision.toISOString()
  };
}
