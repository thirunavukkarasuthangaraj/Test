import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessToFollowComponent } from './business-to-follow.component';

describe('BusinessToFollowComponent', () => {
  let component: BusinessToFollowComponent;
  let fixture: ComponentFixture<BusinessToFollowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessToFollowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessToFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
