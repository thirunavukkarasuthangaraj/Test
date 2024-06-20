import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CommunityCardComponent } from './community-card.component';

describe('CommunityCardComponent', () => {
  let component: CommunityCardComponent;
  let fixture: ComponentFixture<CommunityCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
