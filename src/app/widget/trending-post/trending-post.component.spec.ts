import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { TrendingPostComponent } from './trending-post.component';

describe('TrendingPostComponent', () => {
  let component: TrendingPostComponent;
  let fixture: ComponentFixture<TrendingPostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TrendingPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrendingPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
