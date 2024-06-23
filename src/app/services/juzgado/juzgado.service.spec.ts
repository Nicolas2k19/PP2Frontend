import { TestBed } from '@angular/core/testing';

import { JuzgadoService } from './juzgado.service';

describe('JuzgadoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JuzgadoService = TestBed.get(JuzgadoService);
    expect(service).toBeTruthy();
  });
});