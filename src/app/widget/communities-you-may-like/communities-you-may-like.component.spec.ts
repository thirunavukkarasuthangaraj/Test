import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CommunitiesYouMayLikeComponent } from './communities-you-may-like.component';

describe('CommunitiesYouMayLikeComponent', () => {
  let component: CommunitiesYouMayLikeComponent;
  let fixture: ComponentFixture<CommunitiesYouMayLikeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitiesYouMayLikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitiesYouMayLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
