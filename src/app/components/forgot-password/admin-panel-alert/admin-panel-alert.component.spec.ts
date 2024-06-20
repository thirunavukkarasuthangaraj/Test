import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { AdminPanelAlertComponent } from './admin-panel-alert.component';

describe('AdminPanelAlertComponent', () => {
  let component: AdminPanelAlertComponent;
  let fixture: ComponentFixture<AdminPanelAlertComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPanelAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
