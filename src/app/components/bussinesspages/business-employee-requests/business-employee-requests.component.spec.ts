import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessEmployeeRequestsComponent } from './business-employee-requests.component';

describe('BusinessEmployeeRequestsComponent', () => {
  let component: BusinessEmployeeRequestsComponent;
  let fixture: ComponentFixture<BusinessEmployeeRequestsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessEmployeeRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessEmployeeRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
