import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { NetMemberspageComponent } from './net-memberspage.component';

describe('NetMemberspageComponent', () => {
  let component: NetMemberspageComponent;
  let fixture: ComponentFixture<NetMemberspageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NetMemberspageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetMemberspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
