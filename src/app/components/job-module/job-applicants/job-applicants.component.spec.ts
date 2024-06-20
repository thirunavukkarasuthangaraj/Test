import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobApplicantsComponent } from './job-applicants.component';

describe('JobApplicantsComponent', () => {
  let component: JobApplicantsComponent;
  let fixture: ComponentFixture<JobApplicantsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobApplicantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
