import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobsViewedByComponent } from './jobs-viewed-by.component';

describe('JobsViewedByComponent', () => {
  let component: JobsViewedByComponent;
  let fixture: ComponentFixture<JobsViewedByComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsViewedByComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsViewedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
