import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SimilarBusinessNearYouComponent } from './similar-business-near-you.component';

describe('SimilarBusinessNearYouComponent', () => {
  let component: SimilarBusinessNearYouComponent;
  let fixture: ComponentFixture<SimilarBusinessNearYouComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimilarBusinessNearYouComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarBusinessNearYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
