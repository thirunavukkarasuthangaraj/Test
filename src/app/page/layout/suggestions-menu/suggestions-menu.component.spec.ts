import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SuggestionsMenuComponent } from './suggestions-menu.component';

describe('SuggestionsMenuComponent', () => {
  let component: SuggestionsMenuComponent;
  let fixture: ComponentFixture<SuggestionsMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestionsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
