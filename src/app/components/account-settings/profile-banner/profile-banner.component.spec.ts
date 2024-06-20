import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ProfileBannerComponent } from './profile-banner.component';

describe('ProfileBannerComponent', () => {
  let component: ProfileBannerComponent;
  let fixture: ComponentFixture<ProfileBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
