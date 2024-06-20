import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { TeamInviteSentComponent } from './team-invite-sent.component';

describe('TeamInviteSentComponent', () => {
  let component: TeamInviteSentComponent;
  let fixture: ComponentFixture<TeamInviteSentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamInviteSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamInviteSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
