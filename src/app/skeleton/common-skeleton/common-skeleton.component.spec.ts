import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CommonSkeletonComponent } from './common-skeleton.component';

describe('CommonSkeletonComponent', () => {
  let component: CommonSkeletonComponent;
  let fixture: ComponentFixture<CommonSkeletonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSkeletonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
