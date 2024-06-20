import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidatesProfileDetailsComponent } from './candidates-profile-details.component';

describe('CandidatesProfileDetailsComponent', () => {
  let component: CandidatesProfileDetailsComponent;
  let fixture: ComponentFixture<CandidatesProfileDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatesProfileDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatesProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
