import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobRequestsReceivedComponent } from './job-requests-received.component';

describe('JobRequestsReceivedComponent', () => {
  let component: JobRequestsReceivedComponent;
  let fixture: ComponentFixture<JobRequestsReceivedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobRequestsReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobRequestsReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
