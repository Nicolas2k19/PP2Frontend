import { TestBed } from '@angular/core/testing';

import { ConfigurarMensajesService } from './config-mensajes.service';

describe('ConfigurarMensajesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigurarMensajesService = TestBed.get(ConfigurarMensajesService);
    expect(service).toBeTruthy();
  });
});
