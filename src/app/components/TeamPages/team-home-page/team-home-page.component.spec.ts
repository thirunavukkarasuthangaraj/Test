import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { TeamHomePageComponent } from './team-home-page.component';

describe('TeamHomePageComponent', () => {
  let component: TeamHomePageComponent;
  let fixture: ComponentFixture<TeamHomePageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
