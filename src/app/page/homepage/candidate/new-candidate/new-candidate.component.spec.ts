import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { NewCandidateComponent } from './new-candidate.component';

describe('NewCandidateComponent', () => {
  let component: NewCandidateComponent;
  let fixture: ComponentFixture<NewCandidateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
