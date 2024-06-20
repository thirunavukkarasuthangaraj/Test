import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessFollowersRequestComponent } from './business-followers-request.component';

describe('BusinessFollowersRequestComponent', () => {
  let component: BusinessFollowersRequestComponent;
  let fixture: ComponentFixture<BusinessFollowersRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessFollowersRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessFollowersRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
