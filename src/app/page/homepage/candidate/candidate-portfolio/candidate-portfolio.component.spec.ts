import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidatePortfolioComponent } from './candidate-portfolio.component';

describe('CandidatePortfolioComponent', () => {
  let component: CandidatePortfolioComponent;
  let fixture: ComponentFixture<CandidatePortfolioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatePortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatePortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
