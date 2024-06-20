import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidateInvitedForJobFilterComponent } from './candidate-invited-for-job-filter.component';

describe('CandidateInvitedForJobFilterComponent', () => {
  let component: CandidateInvitedForJobFilterComponent;
  let fixture: ComponentFixture<CandidateInvitedForJobFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateInvitedForJobFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateInvitedForJobFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
