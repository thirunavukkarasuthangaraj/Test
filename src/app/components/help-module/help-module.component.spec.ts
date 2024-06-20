import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { HelpModuleComponent } from './help-module.component';

describe('HelpModuleComponent', () => {
  let component: HelpModuleComponent;
  let fixture: ComponentFixture<HelpModuleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
