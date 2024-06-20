import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobsYouMightBeIntrestedInComponent } from './jobs-you-might-be-intrested-in.component';

describe('JobsYouMightBeIntrestedInComponent', () => {
  let component: JobsYouMightBeIntrestedInComponent;
  let fixture: ComponentFixture<JobsYouMightBeIntrestedInComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsYouMightBeIntrestedInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsYouMightBeIntrestedInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
