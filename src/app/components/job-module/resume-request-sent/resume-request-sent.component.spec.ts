import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ResumeRequestSentComponent } from './resume-request-sent.component';

describe('ResumeRequestSentComponent', () => {
  let component: ResumeRequestSentComponent;
  let fixture: ComponentFixture<ResumeRequestSentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeRequestSentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeRequestSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
