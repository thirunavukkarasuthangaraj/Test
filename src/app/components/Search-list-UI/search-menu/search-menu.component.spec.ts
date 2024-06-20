import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SearchMenuComponent } from './search-menu.component';

describe('SearchMenuComponent', () => {
  let component: SearchMenuComponent;
  let fixture: ComponentFixture<SearchMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
