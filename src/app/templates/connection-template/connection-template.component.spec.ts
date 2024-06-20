import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ConnectionTemplateComponent } from './connection-template.component';

describe('ConnectionTemplateComponent', () => {
  let component: ConnectionTemplateComponent;
  let fixture: ComponentFixture<ConnectionTemplateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
