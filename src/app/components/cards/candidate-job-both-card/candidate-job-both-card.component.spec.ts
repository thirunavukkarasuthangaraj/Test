import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidateJobBothCardComponent } from './candidate-job-both-card.component';

describe('CandidateJobBothCardComponent', () => {
  let component: CandidateJobBothCardComponent;
  let fixture: ComponentFixture<CandidateJobBothCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateJobBothCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateJobBothCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
