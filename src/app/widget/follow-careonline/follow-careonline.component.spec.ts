import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { FollowCareonlineComponent } from './follow-careonline.component';

describe('FollowCareonlineComponent', () => {
  let component: FollowCareonlineComponent;
  let fixture: ComponentFixture<FollowCareonlineComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowCareonlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowCareonlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
