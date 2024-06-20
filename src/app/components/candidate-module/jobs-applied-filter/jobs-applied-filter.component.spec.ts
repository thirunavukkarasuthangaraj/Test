import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobsAppliedFilterComponent } from './jobs-applied-filter.component';

describe('JobsAppliedFilterComponent', () => {
  let component: JobsAppliedFilterComponent;
  let fixture: ComponentFixture<JobsAppliedFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsAppliedFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsAppliedFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
