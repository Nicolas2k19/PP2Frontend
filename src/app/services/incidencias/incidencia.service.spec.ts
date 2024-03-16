import { TestBed } from '@angular/core/testing';

import { IncidenciaService } from './incidencia.service';

describe('IncidenciaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IncidenciaService = TestBed.get(IncidenciaService);
    expect(service).toBeTruthy();
  });
});
