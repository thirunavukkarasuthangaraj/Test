import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { HelpSearchComponent } from './help-search.component';

describe('HelpSearchComponent', () => {
  let component: HelpSearchComponent;
  let fixture: ComponentFixture<HelpSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HelpSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
