import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidateYouMightBeIntrestedInComponent } from './candidate-you-might-be-intrested-in.component';

describe('CandidateYouMightBeIntrestedInComponent', () => {
  let component: CandidateYouMightBeIntrestedInComponent;
  let fixture: ComponentFixture<CandidateYouMightBeIntrestedInComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateYouMightBeIntrestedInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateYouMightBeIntrestedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
