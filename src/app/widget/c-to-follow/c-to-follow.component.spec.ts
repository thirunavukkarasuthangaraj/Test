import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CToFollowComponent } from './c-to-follow.component';

describe('CToFollowComponent', () => {
  let component: CToFollowComponent;
  let fixture: ComponentFixture<CToFollowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CToFollowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CToFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
