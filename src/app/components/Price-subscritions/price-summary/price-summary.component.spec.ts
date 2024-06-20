import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PriceSummaryComponent } from './price-summary.component';

describe('PriceSummaryComponent', () => {
  let component: PriceSummaryComponent;
  let fixture: ComponentFixture<PriceSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
