import { TestBed, async, inject } from '@angular/core/testing';

import { AuthSupervisorGuard } from './auth-supervisor.guard';

describe('AuthSupervisorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthSupervisorGuard]
    });
  });

  it('should ...', inject([AuthSupervisorGuard], (guard: AuthSupervisorGuard) => {
    expect(guard).toBeTruthy();
  }));
});
