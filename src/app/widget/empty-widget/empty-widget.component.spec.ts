import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { EmptyWidgetComponent } from './empty-widget.component';

describe('EmptyWidgetComponent', () => {
  let component: EmptyWidgetComponent;
  let fixture: ComponentFixture<EmptyWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmptyWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
