import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CommunityPageadminComponent } from './community-pageadmin.component';

describe('CommunityPageadminComponent', () => {
  let component: CommunityPageadminComponent;
  let fixture: ComponentFixture<CommunityPageadminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityPageadminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityPageadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
