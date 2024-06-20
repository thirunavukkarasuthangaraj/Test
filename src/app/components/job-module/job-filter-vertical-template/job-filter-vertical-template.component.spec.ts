import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobFilterVerticalTemplateComponent } from './job-filter-vertical-template.component';

describe('JobFilterVerticalTemplateComponent', () => {
  let component: JobFilterVerticalTemplateComponent;
  let fixture: ComponentFixture<JobFilterVerticalTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobFilterVerticalTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobFilterVerticalTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
