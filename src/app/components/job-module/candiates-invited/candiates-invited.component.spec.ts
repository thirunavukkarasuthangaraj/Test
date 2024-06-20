import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandiatesInvitedComponent } from './candiates-invited.component';

describe('CandiatesInvitedComponent', () => {
  let component: CandiatesInvitedComponent;
  let fixture: ComponentFixture<CandiatesInvitedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandiatesInvitedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandiatesInvitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
