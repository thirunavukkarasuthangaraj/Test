import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ResumeRequestComponent } from './resume-request.component';

describe('ResumeRequestComponent', () => {
  let component: ResumeRequestComponent;
  let fixture: ComponentFixture<ResumeRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
