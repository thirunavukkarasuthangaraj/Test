import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidatesPageComponent } from './candidates-page.component';

describe('CandidatesPageComponent', () => {
  let component: CandidatesPageComponent;
  let fixture: ComponentFixture<CandidatesPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
