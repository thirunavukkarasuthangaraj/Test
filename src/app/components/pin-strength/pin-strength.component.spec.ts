import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PinStrengthComponent } from './pin-strength.component';

describe('PinStrengthComponent', () => {
  let component: PinStrengthComponent;
  let fixture: ComponentFixture<PinStrengthComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PinStrengthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinStrengthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
