import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { NetNetworkComponent } from './net-network.component';

describe('NetNetworkComponent', () => {
  let component: NetNetworkComponent;
  let fixture: ComponentFixture<NetNetworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NetNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
