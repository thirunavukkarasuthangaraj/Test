import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidateJobDetailsComponent } from './candidate-job-details.component';

describe('CandidateJobDetailsComponent', () => {
  let component: CandidateJobDetailsComponent;
  let fixture: ComponentFixture<CandidateJobDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateJobDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateJobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
