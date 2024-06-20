import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SvgTemplatesComponent } from './svg-templates.component';

describe('SvgTemplatesComponent', () => {
  let component: SvgTemplatesComponent;
  let fixture: ComponentFixture<SvgTemplatesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
