import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ProfileNavigationHeaderComponent } from './profile-navigation-header.component';

describe('ProfileNavigationHeaderComponent', () => {
  let component: ProfileNavigationHeaderComponent;
  let fixture: ComponentFixture<ProfileNavigationHeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileNavigationHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileNavigationHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
