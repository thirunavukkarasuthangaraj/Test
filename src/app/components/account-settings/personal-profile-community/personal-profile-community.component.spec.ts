import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PersonalProfileCommunityComponent } from './personal-profile-community.component';

describe('PersonalProfileCommunityComponent', () => {
  let component: PersonalProfileCommunityComponent;
  let fixture: ComponentFixture<PersonalProfileCommunityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalProfileCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalProfileCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
