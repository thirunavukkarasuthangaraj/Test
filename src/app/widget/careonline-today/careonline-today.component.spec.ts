import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CareonlineTodayComponent } from './careonline-today.component';

describe('CareonlineTodayComponent', () => {
  let component: CareonlineTodayComponent;
  let fixture: ComponentFixture<CareonlineTodayComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CareonlineTodayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareonlineTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
