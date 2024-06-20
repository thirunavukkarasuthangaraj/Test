import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PeopleYouMayKnowComponent } from './people-you-may-know.component';

describe('PeopleYouMayKnowComponent', () => {
  let component: PeopleYouMayKnowComponent;
  let fixture: ComponentFixture<PeopleYouMayKnowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleYouMayKnowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleYouMayKnowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
