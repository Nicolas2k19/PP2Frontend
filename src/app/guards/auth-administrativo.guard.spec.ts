import { TestBed, async, inject } from '@angular/core/testing';

import { AuthAdministrativoGuard } from './auth-administrativo.guard';

describe('AuthAdministrativoGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthAdministrativoGuard]
    });
  });

  it('should ...', inject([AuthAdministrativoGuard], (guard: AuthAdministrativoGuard) => {
    expect(guard).toBeTruthy();
  }));
});
