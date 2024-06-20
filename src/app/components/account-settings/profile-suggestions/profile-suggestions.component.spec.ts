import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ProfileSuggestionsComponent } from './profile-suggestions.component';

describe('ProfileSuggestionsComponent', () => {
  let component: ProfileSuggestionsComponent;
  let fixture: ComponentFixture<ProfileSuggestionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSuggestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
