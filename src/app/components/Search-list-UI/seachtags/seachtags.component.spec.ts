import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SeachtagsComponent } from './seachtags.component';

describe('SeachtagsComponent', () => {
  let component: SeachtagsComponent;
  let fixture: ComponentFixture<SeachtagsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SeachtagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeachtagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
