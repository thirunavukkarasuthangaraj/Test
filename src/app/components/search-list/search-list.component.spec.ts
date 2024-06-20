import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SearchListComponent } from './search-list.component';

describe('SearchListComponent', () => {
  let component: SearchListComponent;
  let fixture: ComponentFixture<SearchListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
