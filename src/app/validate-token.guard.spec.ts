import { TestBed, inject, waitForAsync as  } from '@angular/core/testing';

import { ValidateTokenGuard } from './validate-token.guard';

describe('ValidateTokenGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidateTokenGuard]
    });
  });

  it('should ...', inject([ValidateTokenGuard], (guard: ValidateTokenGuard) => {
    expect(guard).toBeTruthy();
  }));
});
