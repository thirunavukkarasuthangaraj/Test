import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { TeamcardComponent } from './teamcard.component';

describe('TeamcardComponent', () => {
  let component: TeamcardComponent;
  let fixture: ComponentFixture<TeamcardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
