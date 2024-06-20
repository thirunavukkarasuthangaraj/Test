import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { DeactivateCommunityComponent } from './deactivate-community.component';

describe('DeactivateCommunityComponent', () => {
  let component: DeactivateCommunityComponent;
  let fixture: ComponentFixture<DeactivateCommunityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeactivateCommunityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeactivateCommunityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
