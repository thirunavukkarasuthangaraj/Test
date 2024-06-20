import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessActiveInActiveComponent } from './business-active-in-active.component';

describe('BusinessActiveInActiveComponent', () => {
  let component: BusinessActiveInActiveComponent;
  let fixture: ComponentFixture<BusinessActiveInActiveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessActiveInActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessActiveInActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
