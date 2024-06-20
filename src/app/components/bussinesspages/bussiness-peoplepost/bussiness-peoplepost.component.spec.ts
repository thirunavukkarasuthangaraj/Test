import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { BussinessPeoplepostComponent } from './bussiness-peoplepost.component';

describe('BussinessPeoplepostComponent', () => {
  let component: BussinessPeoplepostComponent;
  let fixture: ComponentFixture<BussinessPeoplepostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BussinessPeoplepostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BussinessPeoplepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
