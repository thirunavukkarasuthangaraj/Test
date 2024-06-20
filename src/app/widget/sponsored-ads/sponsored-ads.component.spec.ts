import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SponsoredAdsComponent } from './sponsored-ads.component';

describe('SponsoredAdsComponent', () => {
  let component: SponsoredAdsComponent;
  let fixture: ComponentFixture<SponsoredAdsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SponsoredAdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsoredAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
