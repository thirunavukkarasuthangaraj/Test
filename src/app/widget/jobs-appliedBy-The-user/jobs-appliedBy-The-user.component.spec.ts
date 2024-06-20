/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JobsAppliedByTheUserComponent } from './jobs-appliedBy-The-user.component';

describe('JobsAppliedByTheUserComponent', () => {
  let component: JobsAppliedByTheUserComponent;
  let fixture: ComponentFixture<JobsAppliedByTheUserComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ JobsAppliedByTheUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsAppliedByTheUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
