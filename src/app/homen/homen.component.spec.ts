import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomenComponent } from './homen.component';

describe('HomenComponent', () => {
  let component: HomenComponent;
  let fixture: ComponentFixture<HomenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
