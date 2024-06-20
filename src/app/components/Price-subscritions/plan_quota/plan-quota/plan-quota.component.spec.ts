import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PlanQuotaComponent } from './PlanQuotaComponent';

describe('PlanQuotaComponent', () => {
  let component: PlanQuotaComponent;
  let fixture: ComponentFixture<PlanQuotaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanQuotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
