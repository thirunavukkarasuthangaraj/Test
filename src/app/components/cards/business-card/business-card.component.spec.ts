import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BusinessCardComponent } from './business-card.component';

describe('BusinessCardComponent', () => {
  let component: BusinessCardComponent;
  let fixture: ComponentFixture<BusinessCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
