import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { DeactivateBusinessComponent } from './deactivate-business.component';

describe('DeactivateBusinessComponent', () => {
  let component: DeactivateBusinessComponent;
  let fixture: ComponentFixture<DeactivateBusinessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivateBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
