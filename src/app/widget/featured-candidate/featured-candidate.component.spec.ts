import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { FeaturedCandidateComponent } from './featured-candidate.component';

describe('FeaturedCandidateComponent', () => {
  let component: FeaturedCandidateComponent;
  let fixture: ComponentFixture<FeaturedCandidateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
