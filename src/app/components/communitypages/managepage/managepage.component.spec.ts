import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { ManagepageComponent } from './managepage.component';

describe('ManagepageComponent', () => {
  let component: ManagepageComponent;
  let fixture: ComponentFixture<ManagepageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
