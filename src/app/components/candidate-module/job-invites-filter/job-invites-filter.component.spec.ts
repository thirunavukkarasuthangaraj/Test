import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobInvitesFilterComponent } from './job-invites-filter.component';

describe('JobInvitesFilterComponent', () => {
  let component: JobInvitesFilterComponent;
  let fixture: ComponentFixture<JobInvitesFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobInvitesFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobInvitesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
