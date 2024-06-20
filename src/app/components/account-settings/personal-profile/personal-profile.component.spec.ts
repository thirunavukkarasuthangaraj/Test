import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PersonalProfileComponent } from './personal-profile.component';

describe('PersonalProfileComponent', () => {
  let component: PersonalProfileComponent;
  let fixture: ComponentFixture<PersonalProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
