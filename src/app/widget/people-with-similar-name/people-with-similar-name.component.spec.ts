import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PeopleWithSimilarNameComponent } from './people-with-similar-name.component';

describe('PeopleWithSimilarNameComponent', () => {
  let component: PeopleWithSimilarNameComponent;
  let fixture: ComponentFixture<PeopleWithSimilarNameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleWithSimilarNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleWithSimilarNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
