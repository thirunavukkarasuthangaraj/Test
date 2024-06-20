import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessFollowersRequestSentComponent } from './business-followers-request-sent.component';

describe('BusinessFollowersRequestSentComponent', () => {
  let component: BusinessFollowersRequestSentComponent;
  let fixture: ComponentFixture<BusinessFollowersRequestSentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessFollowersRequestSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessFollowersRequestSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
