import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { TrendingHashtagComponent } from './trending-hashtag.component';

describe('TrendingHashtagComponent', () => {
  let component: TrendingHashtagComponent;
  let fixture: ComponentFixture<TrendingHashtagComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingHashtagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingHashtagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
