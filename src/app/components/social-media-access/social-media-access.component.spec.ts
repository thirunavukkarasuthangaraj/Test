import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { SocialMediaAccessComponent } from './social-media-access.component';

describe('SocialMediaAccessComponent', () => {
  let component: SocialMediaAccessComponent;
  let fixture: ComponentFixture<SocialMediaAccessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialMediaAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialMediaAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
