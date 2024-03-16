import { TestBed } from '@angular/core/testing';

import { PruebaDeVidaService } from './prueba-de-vida.service';

describe('PruebaDeVidaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PruebaDeVidaService = TestBed.get(PruebaDeVidaService);
    expect(service).toBeTruthy();
  });
});
