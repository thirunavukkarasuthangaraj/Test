import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PasswordResetConfirmedComponent } from './password-reset-confirmed.component';

describe('PasswordResetConfirmedComponent', () => {
  let component: PasswordResetConfirmedComponent;
  let fixture: ComponentFixture<PasswordResetConfirmedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordResetConfirmedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordResetConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
