import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { FollowerComponent } from './follower.component';

describe('FollowerComponent', () => {
  let component: FollowerComponent;
  let fixture: ComponentFixture<FollowerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FollowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FollowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
