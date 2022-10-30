import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaServComponent } from './mesa-serv.component';

describe('MesaServComponent', () => {
  let component: MesaServComponent;
  let fixture: ComponentFixture<MesaServComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MesaServComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MesaServComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
