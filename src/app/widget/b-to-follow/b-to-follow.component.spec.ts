import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BToFollowComponent } from './b-to-follow.component';

describe('BToFollowComponent', () => {
  let component: BToFollowComponent;
  let fixture: ComponentFixture<BToFollowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BToFollowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BToFollowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
