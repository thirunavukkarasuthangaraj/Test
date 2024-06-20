import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BillingHistroyComponent } from './billing-histroy.component';

describe('BillingHistroyComponent', () => {
  let component: BillingHistroyComponent;
  let fixture: ComponentFixture<BillingHistroyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BillingHistroyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingHistroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
