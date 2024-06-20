import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PriceAvilalbleComponent } from './price-avilalble.component';

describe('PriceAvilalbleComponent', () => {
  let component: PriceAvilalbleComponent;
  let fixture: ComponentFixture<PriceAvilalbleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceAvilalbleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceAvilalbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
