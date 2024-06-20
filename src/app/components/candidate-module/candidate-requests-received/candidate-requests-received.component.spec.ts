import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidateRequestsReceivedComponent } from './candidate-requests-received.component';

describe('CandidateRequestsReceivedComponent', () => {
  let component: CandidateRequestsReceivedComponent;
  let fixture: ComponentFixture<CandidateRequestsReceivedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateRequestsReceivedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateRequestsReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
