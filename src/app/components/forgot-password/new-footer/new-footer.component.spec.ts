import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { NewFooterComponent } from './new-footer.component';

describe('NewFooterComponent', () => {
  let component: NewFooterComponent;
  let fixture: ComponentFixture<NewFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
