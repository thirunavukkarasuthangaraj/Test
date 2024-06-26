import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { NetNavbarpageComponent } from './net-navbarpage.component';

describe('NetNavbarpageComponent', () => {
  let component: NetNavbarpageComponent;
  let fixture: ComponentFixture<NetNavbarpageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NetNavbarpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetNavbarpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
