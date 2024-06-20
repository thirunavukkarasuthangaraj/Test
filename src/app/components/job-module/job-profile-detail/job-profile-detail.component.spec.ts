import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobProfileDetailComponent } from './job-profile-detail.component';

describe('JobProfileDetailComponent', () => {
  let component: JobProfileDetailComponent;
  let fixture: ComponentFixture<JobProfileDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobProfileDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobProfileDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
