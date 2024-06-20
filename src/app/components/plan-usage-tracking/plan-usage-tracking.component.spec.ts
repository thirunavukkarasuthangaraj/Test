import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PlanUsageTrackingComponent } from './plan-usage-tracking.component';

describe('PlanUsageTrackingComponent', () => {
  let component: PlanUsageTrackingComponent;
  let fixture: ComponentFixture<PlanUsageTrackingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanUsageTrackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanUsageTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
