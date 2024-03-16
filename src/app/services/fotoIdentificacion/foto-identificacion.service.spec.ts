import { TestBed } from '@angular/core/testing';

import { FotoIdentificacionService } from './foto-identificacion.service';

describe('FotoIdentificacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FotoIdentificacionService = TestBed.get(FotoIdentificacionService);
    expect(service).toBeTruthy();
  });
});
