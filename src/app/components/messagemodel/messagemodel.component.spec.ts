import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { MessagemodelComponent } from './messagemodel.component';

describe('MessagemodelComponent', () => {
  let component: MessagemodelComponent;
  let fixture: ComponentFixture<MessagemodelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagemodelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
