import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessJobsComponent } from './business-jobs.component';

describe('BusinessJobsComponent', () => {
  let component: BusinessJobsComponent;
  let fixture: ComponentFixture<BusinessJobsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
