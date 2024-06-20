import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PromotedAdsComponent } from './promoted-ads.component';

describe('PromotedAdsComponent', () => {
  let component: PromotedAdsComponent;
  let fixture: ComponentFixture<PromotedAdsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotedAdsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotedAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
