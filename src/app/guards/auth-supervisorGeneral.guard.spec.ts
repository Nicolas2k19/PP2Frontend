import { TestBed, async, inject } from '@angular/core/testing';

import { AuthSupervisorGeneralGuard } from './auth-supervisorGeneral.guard';

describe('AuthSupervisorGeneralGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthSupervisorGeneralGuard]
    });
  });

  it('should ...', inject([AuthSupervisorGeneralGuard], (guard: AuthSupervisorGeneralGuard) => {
    expect(guard).toBeTruthy();
  }));
});
