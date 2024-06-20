import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessAnalyticsComponent } from './business-analytics.component';

describe('BusinessAnalyticsComponent', () => {
  let component: BusinessAnalyticsComponent;
  let fixture: ComponentFixture<BusinessAnalyticsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessAnalyticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
