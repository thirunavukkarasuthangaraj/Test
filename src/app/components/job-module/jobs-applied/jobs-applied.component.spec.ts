import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';
import { JobsAppliedcandidateComponent } from './jobs-applied.component';

describe('JobAppliedCandidatesComponent', () => {
  let component: JobsAppliedcandidateComponent;
  let fixture: ComponentFixture<JobsAppliedcandidateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsAppliedcandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsAppliedcandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
