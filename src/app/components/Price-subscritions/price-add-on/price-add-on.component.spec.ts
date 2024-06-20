import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PriceAddOnComponent } from './price-add-on.component';

describe('PriceAddOnComponent', () => {
  let component: PriceAddOnComponent;
  let fixture: ComponentFixture<PriceAddOnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceAddOnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceAddOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
