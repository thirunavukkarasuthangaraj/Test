import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { PeopleInyourNetworkComponent } from './people-inyour-network.component';

describe('PeopleInyourNetworkComponent', () => {
  let component: PeopleInyourNetworkComponent;
  let fixture: ComponentFixture<PeopleInyourNetworkComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleInyourNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleInyourNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
