import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { NetHeaderpageComponent } from './net-headerpage.component';

describe('NetHeaderpageComponent', () => {
  let component: NetHeaderpageComponent;
  let fixture: ComponentFixture<NetHeaderpageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NetHeaderpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetHeaderpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
