import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessAdminComponent } from './business-admin.component';

describe('BusinessAdminComponent', () => {
  let component: BusinessAdminComponent;
  let fixture: ComponentFixture<BusinessAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
