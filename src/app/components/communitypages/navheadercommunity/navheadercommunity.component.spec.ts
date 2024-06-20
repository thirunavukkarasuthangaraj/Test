import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { NavheadercommunityComponent } from './navheadercommunity.component';

describe('NavheadercommunityComponent', () => {
  let component: NavheadercommunityComponent;
  let fixture: ComponentFixture<NavheadercommunityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavheadercommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavheadercommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
