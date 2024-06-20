import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SimilarCommunityComponent } from './similar-community.component';

describe('SimilarCommunityComponent', () => {
  let component: SimilarCommunityComponent;
  let fixture: ComponentFixture<SimilarCommunityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimilarCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
