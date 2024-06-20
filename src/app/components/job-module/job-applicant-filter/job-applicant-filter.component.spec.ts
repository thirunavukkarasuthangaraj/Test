import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobApplicantFilterComponent } from './job-applicant-filter.component';

describe('JobApplicantFilterComponent', () => {
  let component: JobApplicantFilterComponent;
  let fixture: ComponentFixture<JobApplicantFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobApplicantFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobApplicantFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
