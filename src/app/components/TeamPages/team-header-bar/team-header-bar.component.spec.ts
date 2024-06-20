import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { TeamHeaderBarComponent } from './team-header-bar.component';

describe('TeamHeaderBarComponent', () => {
  let component: TeamHeaderBarComponent;
  let fixture: ComponentFixture<TeamHeaderBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamHeaderBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamHeaderBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
