import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SearchcandidateComponent } from './searchcandidate.component';

describe('SearchcandidateComponent', () => {
  let component: SearchcandidateComponent;
  let fixture: ComponentFixture<SearchcandidateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchcandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchcandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
