import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidateActivityWidgetComponent } from './candidate-activity-widget.component';

describe('CandidateActivityWidgetComponent', () => {
  let component: CandidateActivityWidgetComponent;
  let fixture: ComponentFixture<CandidateActivityWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateActivityWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateActivityWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
