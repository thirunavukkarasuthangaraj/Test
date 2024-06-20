import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidateInviteComponent } from './candidate-invite.component';

describe('CandidateInviteComponent', () => {
  let component: CandidateInviteComponent;
  let fixture: ComponentFixture<CandidateInviteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateInviteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
