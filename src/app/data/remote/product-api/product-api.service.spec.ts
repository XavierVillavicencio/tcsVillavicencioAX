import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductApiService } from './product-api.service';
import { ProductListResponseDTO } from '../../../core/entities/product.entity';


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
    httpMock.verify(); 
  });

  it('debe obtener todos los productos correctamente', (done) => {
    service.getAll().subscribe(productos => {
      expect(productos.length).toBe(2);
      expect(productos[0].id).toBe('123');
      done();
    });
  
    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
  

  it('debe enviar una solicitud DELETE al endpoint correcto', () => {
    const id = 'abc123';
  
    service.delete(id).subscribe(response => {
      expect(response).toBeUndefined(); 
    });
  
    const req = httpMock.expectOne(`/bp/products/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null); 
  });
  
  it('debe verificar si el ID existe', () => {
    const id = 'prod001';
  
    service.verify(id).subscribe(resultado => {
      expect(resultado).toBeTrue(); 
    });
  
    const req = httpMock.expectOne(`/bp/products/verification/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });
  

});
