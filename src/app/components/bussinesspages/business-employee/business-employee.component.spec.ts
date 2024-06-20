import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessEmployeeComponent } from './business-employee.component';

describe('BusinessEmployeeComponent', () => {
  let component: BusinessEmployeeComponent;
  let fixture: ComponentFixture<BusinessEmployeeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
