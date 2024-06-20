import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { AllUserListComponent } from './all-user-list.component';

describe('AllUserListComponent', () => {
  let component: AllUserListComponent;
  let fixture: ComponentFixture<AllUserListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AllUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
