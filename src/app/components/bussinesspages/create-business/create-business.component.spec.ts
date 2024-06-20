import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CreateBusinessComponent } from './create-business.component';

describe('CreateBusinessComponent', () => {
  let component: CreateBusinessComponent;
  let fixture: ComponentFixture<CreateBusinessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
