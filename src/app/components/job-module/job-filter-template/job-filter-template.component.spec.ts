import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobFilterTemplateComponent } from "./JobFilterTemplateComponent";

describe('JobFilterTemplateComponent', () => {
  let component: JobFilterTemplateComponent;
  let fixture: ComponentFixture<JobFilterTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobFilterTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobFilterTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
