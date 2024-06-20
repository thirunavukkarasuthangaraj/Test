import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { InvitesCerditsComponent } from './invites-cerdits.component';

describe('InvitesCerditsComponent', () => {
  let component: InvitesCerditsComponent;
  let fixture: ComponentFixture<InvitesCerditsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitesCerditsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitesCerditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
