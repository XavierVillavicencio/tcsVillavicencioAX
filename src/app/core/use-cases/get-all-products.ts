import { ProductRepository } from '../interfaces/product.repository';

export class GetAllProducts {
  constructor(private repo: ProductRepository) {}
  execute() {
    return this.repo.getAll();
  }
}