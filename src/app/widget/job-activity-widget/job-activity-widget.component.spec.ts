import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobActivityWidgetComponent } from './job-activity-widget.component';

describe('JobActivityWidgetComponent', () => {
  let component: JobActivityWidgetComponent;
  let fixture: ComponentFixture<JobActivityWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobActivityWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobActivityWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
