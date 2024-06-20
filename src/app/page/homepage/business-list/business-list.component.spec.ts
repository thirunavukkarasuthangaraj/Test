import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessListComponent } from './business-list.component';

describe('BusinessListComponent', () => {
  let component: BusinessListComponent;
  let fixture: ComponentFixture<BusinessListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
