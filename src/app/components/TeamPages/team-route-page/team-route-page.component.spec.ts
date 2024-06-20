import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { TeamRoutePageComponent } from './team-route-page.component';

describe('TeamRoutePageComponent', () => {
  let component: TeamRoutePageComponent;
  let fixture: ComponentFixture<TeamRoutePageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamRoutePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamRoutePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
