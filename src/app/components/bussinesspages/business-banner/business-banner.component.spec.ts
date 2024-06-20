import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessBannerComponent } from "./BusinessBannerComponent";

describe('BusinessBannerComponent', () => {
  let component: BusinessBannerComponent;
  let fixture: ComponentFixture<BusinessBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
