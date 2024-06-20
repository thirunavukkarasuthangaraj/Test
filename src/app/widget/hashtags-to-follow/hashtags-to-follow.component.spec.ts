import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { HashtagsToFollowComponent } from './hashtags-to-follow.component';

describe('HashtagsToFollowComponent', () => {
  let component: HashtagsToFollowComponent;
  let fixture: ComponentFixture<HashtagsToFollowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HashtagsToFollowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HashtagsToFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
