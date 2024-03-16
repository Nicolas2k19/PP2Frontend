import { TestBed } from '@angular/core/testing';

import { ProvinciaLocalidadService } from './provincia-localidad.service';

describe('ProvinciaLocalidadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProvinciaLocalidadService = TestBed.get(ProvinciaLocalidadService);
    expect(service).toBeTruthy();
  });
});
