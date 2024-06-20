import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PersonalProfileEditComponent } from './personal-profile-edit.component';

describe('PersonalProfileEditComponent', () => {
  let component: PersonalProfileEditComponent;
  let fixture: ComponentFixture<PersonalProfileEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalProfileEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalProfileEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
