import { TestBed } from '@angular/core/testing';

import { RestriccionService } from './restriccion.service';

describe('RestriccionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RestriccionService = TestBed.get(RestriccionService);
    expect(service).toBeTruthy();
  });
});
