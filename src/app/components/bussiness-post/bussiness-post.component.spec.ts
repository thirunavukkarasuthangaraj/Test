import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';
import { BussinessPostComponent } from './bussiness-post.component';


describe('BussinessPostComponent', () => {
  let component: BussinessPostComponent;
  let fixture: ComponentFixture<BussinessPostComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BussinessPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BussinessPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
