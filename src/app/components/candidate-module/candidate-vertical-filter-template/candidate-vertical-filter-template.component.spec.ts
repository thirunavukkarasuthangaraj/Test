import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidateVerticalFilterTemplateComponent } from './candidate-vertical-filter-template.component';

describe('CandidateVerticalFilterTemplateComponent', () => {
  let component: CandidateVerticalFilterTemplateComponent;
  let fixture: ComponentFixture<CandidateVerticalFilterTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateVerticalFilterTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateVerticalFilterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
