import { TestBed } from '@angular/core/testing';

import { PruebaDeVidaMultipleService } from './prueba-de-vida-multiple.service';

describe('PruebaDeVidaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PruebaDeVidaMultipleService = TestBed.get(PruebaDeVidaMultipleService);
    expect(service).toBeTruthy();
  });
});
