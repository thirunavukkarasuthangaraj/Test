import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { JoblikedListComponent } from './jobliked-list.component';

describe('JoblikedListComponent', () => {
  let component: JoblikedListComponent;
  let fixture: ComponentFixture<JoblikedListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JoblikedListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoblikedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
