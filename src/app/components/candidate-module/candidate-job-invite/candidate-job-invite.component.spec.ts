import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidateJobInviteComponent } from './candidate-job-invite.component';

describe('CandidateJobInviteComponent', () => {
  let component: CandidateJobInviteComponent;
  let fixture: ComponentFixture<CandidateJobInviteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateJobInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateJobInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
