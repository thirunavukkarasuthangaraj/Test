import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PriceBackButtonenableComponent } from './price-back-buttonenable.component';

describe('PriceBackButtonenableComponent', () => {
  let component: PriceBackButtonenableComponent;
  let fixture: ComponentFixture<PriceBackButtonenableComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceBackButtonenableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceBackButtonenableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
