import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { TrendingCommunityComponent } from './trending-community.component';

describe('TrendingCommunityComponent', () => {
  let component: TrendingCommunityComponent;
  let fixture: ComponentFixture<TrendingCommunityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
