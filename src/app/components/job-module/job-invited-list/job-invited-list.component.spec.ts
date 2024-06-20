import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobInvitedListComponent } from './job-invited-list.component';

describe('JobInvitedListComponent', () => {
  let component: JobInvitedListComponent;
  let fixture: ComponentFixture<JobInvitedListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobInvitedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobInvitedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
