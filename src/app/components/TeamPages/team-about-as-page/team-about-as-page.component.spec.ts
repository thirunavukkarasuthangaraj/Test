import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { TeamAboutAsPageComponent } from './team-about-as-page.component';

describe('TeamAboutAsPageComponent', () => {
  let component: TeamAboutAsPageComponent;
  let fixture: ComponentFixture<TeamAboutAsPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamAboutAsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamAboutAsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
