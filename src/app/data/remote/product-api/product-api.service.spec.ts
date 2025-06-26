import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductApiService } from './product-api.service';
import { ProductListResponseDTO } from '../../../core/entities/product.entity';
import { ProductModel } from '../../../core/models/product.model';

describe('ProductApiService', () => {
  let service: ProductApiService;
  let httpMock: HttpTestingController;

  const mockResponse: ProductListResponseDTO = {
    data: [
      {
        id: '123',
        name: 'Producto 1',
        description: 'Descripción del producto 1',
        logo: 'https://cdn.ejemplo.com/logo1.png',
        date_release: new Date('2025-06-30'),
        date_revision: new Date('2026-06-30')
      },
      {
        id: '456',
        name: 'Producto 2',
        description: 'Descripción del producto 2',
        logo: 'https://cdn.ejemplo.com/logo2.png',
        date_release: new Date('2025-07-15'),
        date_revision: new Date('2026-07-15')
      }
    ]
  };
  

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductApiService]
    });

    service = TestBed.inject(ProductApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Asegura que no haya peticiones pendientes
  });

  it('debe obtener todos los productos correctamente', async () => {
    const resultado = service.getAll();

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    const productos = await resultado;
    expect(productos.length).toBe(2);
    expect(productos[0].id).toBe('1');
  });

  it('debe enviar una solicitud DELETE al endpoint correcto', () => {
    const id = '123';
  
    service.delete(id).subscribe(response => {
      expect(response).toBeUndefined(); // porque el body es void
    });
  
    const req = httpMock.expectOne(`/bp/products/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); // no hay body, así que mandamos null
  });
  
  it('debe verificar si el ID existe', () => {
    const id = 'prod001';
  
    service.verify(id).subscribe(resultado => {
      expect(resultado).toBeTrue(); // esperamos true en este caso
    });
  
    const req = httpMock.expectOne(`/bp/products/verification/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });
  

});
