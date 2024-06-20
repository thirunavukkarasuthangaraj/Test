import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CommunityProfileComponent } from './community-profile.component';

describe('CommunityProfileComponent', () => {
  let component: CommunityProfileComponent;
  let fixture: ComponentFixture<CommunityProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
