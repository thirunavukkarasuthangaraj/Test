import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessProfileComponent } from './business-profile.component';

describe('BusinessProfileComponent', () => {
  let component: BusinessProfileComponent;
  let fixture: ComponentFixture<BusinessProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
