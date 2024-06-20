import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CollegueYouMayKnowComponent } from './collegue-you-may-know.component';

describe('CollegueYouMayKnowComponent', () => {
  let component: CollegueYouMayKnowComponent;
  let fixture: ComponentFixture<CollegueYouMayKnowComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CollegueYouMayKnowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegueYouMayKnowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
