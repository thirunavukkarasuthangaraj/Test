import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { FogetPasswordAppUserComponent } from './foget-password-app-user.component';

describe('FogetPasswordAppUserComponent', () => {
  let component: FogetPasswordAppUserComponent;
  let fixture: ComponentFixture<FogetPasswordAppUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FogetPasswordAppUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FogetPasswordAppUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
