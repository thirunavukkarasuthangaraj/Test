import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CommunityBannerComponent } from './community-banner.component';

describe('CommunityBannerComponent', () => {
  let component: CommunityBannerComponent;
  let fixture: ComponentFixture<CommunityBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
