import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { InvitesendComponent } from './invitesend.component';

describe('InvitesendComponent', () => {
  let component: InvitesendComponent;
  let fixture: ComponentFixture<InvitesendComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitesendComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitesendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
