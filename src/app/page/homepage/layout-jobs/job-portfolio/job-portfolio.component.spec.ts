import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobPortfolioComponent } from './job-portfolio.component';

describe('JobPortfolioComponent', () => {
  let component: JobPortfolioComponent;
  let fixture: ComponentFixture<JobPortfolioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
