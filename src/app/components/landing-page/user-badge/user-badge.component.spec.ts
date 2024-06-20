import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { UserBadgeComponent } from './user-badge.component';

describe('UserBadgeComponent', () => {
  let component: UserBadgeComponent;
  let fixture: ComponentFixture<UserBadgeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
