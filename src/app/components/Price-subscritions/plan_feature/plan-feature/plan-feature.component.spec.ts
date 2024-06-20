import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PlanFeatureComponent } from './plan-feature.component';

describe('PlanFeatureComponent', () => {
  let component: PlanFeatureComponent;
  let fixture: ComponentFixture<PlanFeatureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
