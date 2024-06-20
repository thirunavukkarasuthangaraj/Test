import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SuggestedCandidateComponent } from './suggested-candidate.component';

describe('SuggestedCandidateComponent', () => {
  let component: SuggestedCandidateComponent;
  let fixture: ComponentFixture<SuggestedCandidateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
