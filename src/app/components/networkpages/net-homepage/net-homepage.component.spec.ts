import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { NetHomepageComponent } from './net-homepage.component';

describe('NetHomepageComponent', () => {
  let component: NetHomepageComponent;
  let fixture: ComponentFixture<NetHomepageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NetHomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
