import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CommonProfileInfoComponent } from './common-profile-info.component';

describe('CommonProfileInfoComponent', () => {
  let component: CommonProfileInfoComponent;
  let fixture: ComponentFixture<CommonProfileInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonProfileInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonProfileInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
