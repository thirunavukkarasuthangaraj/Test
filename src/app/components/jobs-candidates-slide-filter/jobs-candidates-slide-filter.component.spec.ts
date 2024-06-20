import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobsCandidatesSlideFilterComponent } from './jobs-candidates-slide-filter.component';

describe('JobsCandidatesSlideFilterComponent', () => {
  let component: JobsCandidatesSlideFilterComponent;
  let fixture: ComponentFixture<JobsCandidatesSlideFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsCandidatesSlideFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsCandidatesSlideFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
