import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CommunityProfileCompleteComponent } from './community-profile-complete.component';

describe('CommunityProfileCompleteComponent', () => {
  let component: CommunityProfileCompleteComponent;
  let fixture: ComponentFixture<CommunityProfileCompleteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityProfileCompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityProfileCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
