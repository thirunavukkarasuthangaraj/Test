import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessUserComponent } from './business-user.component';

describe('BusinessUserComponent', () => {
  let component: BusinessUserComponent;
  let fixture: ComponentFixture<BusinessUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
