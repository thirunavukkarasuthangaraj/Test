import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ListingJobCardComponent } from './listing-job-card.component';

describe('ListingJobCardComponent', () => {
  let component: ListingJobCardComponent;
  let fixture: ComponentFixture<ListingJobCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingJobCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingJobCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
