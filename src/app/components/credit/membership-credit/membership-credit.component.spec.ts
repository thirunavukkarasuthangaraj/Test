import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { MembershipCreditComponent } from './membership-credit.component';

describe('MembershipCreditComponent', () => {
  let component: MembershipCreditComponent;
  let fixture: ComponentFixture<MembershipCreditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MembershipCreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembershipCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
