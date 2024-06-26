import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CommunityAdminComponent } from './community-admin.component';

describe('CommunityAdminComponent', () => {
  let component: CommunityAdminComponent;
  let fixture: ComponentFixture<CommunityAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
