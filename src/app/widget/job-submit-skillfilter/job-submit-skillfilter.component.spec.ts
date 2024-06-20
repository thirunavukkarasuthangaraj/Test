import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JobSubmitSkillfilterComponent } from './job-submit-skillfilter.component';

describe('JobSubmitSkillfilterComponent', () => {
  let component: JobSubmitSkillfilterComponent;
  let fixture: ComponentFixture<JobSubmitSkillfilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobSubmitSkillfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobSubmitSkillfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
