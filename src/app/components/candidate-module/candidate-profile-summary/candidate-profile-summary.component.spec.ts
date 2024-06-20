import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidateProfileSummaryComponent } from './candidate-profile-summary.component';

describe('CandidateProfileSummaryComponent', () => {
  let component: CandidateProfileSummaryComponent;
  let fixture: ComponentFixture<CandidateProfileSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateProfileSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateProfileSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
