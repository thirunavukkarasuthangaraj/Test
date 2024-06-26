import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessFollowerComponent } from './business-follower.component';

describe('BusinessFollowerComponent', () => {
  let component: BusinessFollowerComponent;
  let fixture: ComponentFixture<BusinessFollowerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessFollowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessFollowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
