import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { CreateteamModelComponent } from './createteam-model.component';

describe('CreateteamModelComponent', () => {
  let component: CreateteamModelComponent;
  let fixture: ComponentFixture<CreateteamModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateteamModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateteamModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
