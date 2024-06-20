import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ProfileCompletionComponent } from './profile-completion.component';

describe('ProfileCompletionComponent', () => {
  let component: ProfileCompletionComponent;
  let fixture: ComponentFixture<ProfileCompletionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileCompletionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
