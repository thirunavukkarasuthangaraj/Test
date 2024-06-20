import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CreditModelComponent } from './credit-model.component';

describe('CreditModelComponent', () => {
  let component: CreditModelComponent;
  let fixture: ComponentFixture<CreditModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
