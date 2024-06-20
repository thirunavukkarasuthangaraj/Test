import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { LangdingPageNavBarComponent } from './langding-page-nav-bar.component';

describe('LangdingPageNavBarComponent', () => {
  let component: LangdingPageNavBarComponent;
  let fixture: ComponentFixture<LangdingPageNavBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LangdingPageNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LangdingPageNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
