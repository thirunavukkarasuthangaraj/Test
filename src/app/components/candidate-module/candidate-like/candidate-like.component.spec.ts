import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CandidateLikeComponent } from './candidate-like.component';

describe('CandidateLikeComponent', () => {
  let component: CandidateLikeComponent;
  let fixture: ComponentFixture<CandidateLikeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateLikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
