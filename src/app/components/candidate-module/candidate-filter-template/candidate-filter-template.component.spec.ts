import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidateFilterTemplateComponent } from './candidate-filter-template.component';

describe('CandidateFilterTemplateComponent', () => {
  let component: CandidateFilterTemplateComponent;
  let fixture: ComponentFixture<CandidateFilterTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateFilterTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateFilterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
