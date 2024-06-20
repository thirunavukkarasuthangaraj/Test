import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { NetworkCardComponent } from './network-card.component';

describe('NetworkCardComponent', () => {
  let component: NetworkCardComponent;
  let fixture: ComponentFixture<NetworkCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
