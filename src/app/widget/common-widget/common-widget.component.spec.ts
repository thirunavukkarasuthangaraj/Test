import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CommonWidgetComponent } from './common-widget.component';

describe('CommonWidgetComponent', () => {
  let component: CommonWidgetComponent;
  let fixture: ComponentFixture<CommonWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
