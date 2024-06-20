import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SuggestedJobComponent } from './suggested-job.component';

describe('SuggestedJobComponent', () => {
  let component: SuggestedJobComponent;
  let fixture: ComponentFixture<SuggestedJobComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuggestedJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestedJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
