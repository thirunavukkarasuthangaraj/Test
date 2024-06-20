import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { WorkexperienceModalComponent } from './workexperience-modal.component';

describe('WorkexperienceModalComponent', () => {
  let component: WorkexperienceModalComponent;
  let fixture: ComponentFixture<WorkexperienceModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkexperienceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkexperienceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
