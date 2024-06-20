import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidateViewedByComponent } from './candidate-viewed-by.component';

describe('CandidateViewedByComponent', () => {
  let component: CandidateViewedByComponent;
  let fixture: ComponentFixture<CandidateViewedByComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateViewedByComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateViewedByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
