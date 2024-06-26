import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { FeaturedJobsComponent } from './featured-jobs.component';

describe('FeaturedJobsComponent', () => {
  let component: FeaturedJobsComponent;
  let fixture: ComponentFixture<FeaturedJobsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedJobsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
