import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { TeamSideBarNavComponent } from './team-side-bar-nav.component';

describe('TeamSideBarNavComponent', () => {
  let component: TeamSideBarNavComponent;
  let fixture: ComponentFixture<TeamSideBarNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamSideBarNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSideBarNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
