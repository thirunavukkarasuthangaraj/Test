import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { NewNavBarComponent } from './new-nav-bar.component';

describe('NewNavBarComponent', () => {
  let component: NewNavBarComponent;
  let fixture: ComponentFixture<NewNavBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
