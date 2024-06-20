import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessSecuritySettingsComponent } from './business-security-settings.component';

describe('BusinessSecuritySettingsComponent', () => {
  let component: BusinessSecuritySettingsComponent;
  let fixture: ComponentFixture<BusinessSecuritySettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessSecuritySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessSecuritySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
