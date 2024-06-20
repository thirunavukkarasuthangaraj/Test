import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { NetAboutpageComponent } from './net-aboutpage.component';

describe('NetAboutpageComponent', () => {
  let component: NetAboutpageComponent;
  let fixture: ComponentFixture<NetAboutpageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NetAboutpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetAboutpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
