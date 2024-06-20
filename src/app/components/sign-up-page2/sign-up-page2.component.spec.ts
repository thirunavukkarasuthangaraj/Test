import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SignUpPage2Component } from './sign-up-page2.component';

describe('SignUpPage2Component', () => {
  let component: SignUpPage2Component;
  let fixture: ComponentFixture<SignUpPage2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpPage2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpPage2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
