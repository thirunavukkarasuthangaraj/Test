import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { InviteCollegueComponent } from './invite-collegue.component';

describe('InviteCollegueComponent', () => {
  let component: InviteCollegueComponent;
  let fixture: ComponentFixture<InviteCollegueComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteCollegueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteCollegueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
