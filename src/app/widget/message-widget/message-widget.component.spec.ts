import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { MessageWidgetComponent } from './message-widget.component';

describe('MessageWidgetComponent', () => {
  let component: MessageWidgetComponent;
  let fixture: ComponentFixture<MessageWidgetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
