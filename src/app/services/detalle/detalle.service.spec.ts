import { TestBed } from '@angular/core/testing';

import { DetalleService } from './detalle.service';

describe('JuzgadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetalleService = TestBed.get(DetalleService);
    expect(service).toBeTruthy();
  });
});