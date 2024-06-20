import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CopywriteComponent } from './copywrite.component';

describe('CopywriteComponent', () => {
  let component: CopywriteComponent;
  let fixture: ComponentFixture<CopywriteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CopywriteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopywriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
