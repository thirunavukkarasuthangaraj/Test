import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ModelPriceComponent } from './model-price.component';

describe('ModelPriceComponent', () => {
  let component: ModelPriceComponent;
  let fixture: ComponentFixture<ModelPriceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelPriceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
