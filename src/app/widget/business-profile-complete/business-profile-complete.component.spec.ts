import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessProfileCompleteComponent } from './business-profile-complete.component';

describe('BusinessProfileCompleteComponent', () => {
  let component: BusinessProfileCompleteComponent;
  let fixture: ComponentFixture<BusinessProfileCompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessProfileCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProfileCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
