import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobInviteSentComponent } from './job-invite-sent.component';

describe('JobInviteSentComponent', () => {
  let component: JobInviteSentComponent;
  let fixture: ComponentFixture<JobInviteSentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobInviteSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobInviteSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
