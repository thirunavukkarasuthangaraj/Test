import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PlanDowngradeModelComponent } from './plan-downgrade-model.component';

describe('PlanDowngradeModelComponent', () => {
  let component: PlanDowngradeModelComponent;
  let fixture: ComponentFixture<PlanDowngradeModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanDowngradeModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDowngradeModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
