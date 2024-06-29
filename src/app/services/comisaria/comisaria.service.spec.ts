import { TestBed } from '@angular/core/testing';

import { ComisariaService } from './comisaria.service';

describe('ComisariaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ComisariaService = TestBed.get(ComisariaService);
    expect(service).toBeTruthy();
  });
});