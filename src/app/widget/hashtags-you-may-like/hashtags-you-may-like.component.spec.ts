import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { HashtagsYouMayLikeComponent } from './hashtags-you-may-like.component';

describe('HashtagsYouMayLikeComponent', () => {
  let component: HashtagsYouMayLikeComponent;
  let fixture: ComponentFixture<HashtagsYouMayLikeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HashtagsYouMayLikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HashtagsYouMayLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
