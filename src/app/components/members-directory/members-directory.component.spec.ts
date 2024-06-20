import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';

import { MembersDirectoryComponent } from './members-directory.component';

describe('MembersDirectoryComponent', () => {
  let component: MembersDirectoryComponent;
  let fixture: ComponentFixture<MembersDirectoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MembersDirectoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersDirectoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
