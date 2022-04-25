import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupOutletComponent } from './popup-outlet.component';

describe('PopupOutletComponent', () => {
  let component: PopupOutletComponent;
  let fixture: ComponentFixture<PopupOutletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupOutletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupOutletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
