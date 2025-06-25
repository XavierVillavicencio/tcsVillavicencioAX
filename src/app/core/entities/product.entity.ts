export interface ProductListResponseDTO {
    data: ProductEntity[];
  }

export interface ProductEntity {
    id: string,
    name: string,
    description: string,
    logo: string,
    date_release: Date,
    date_revision: Date
}