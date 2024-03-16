import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebasDeVidaComponent } from './pruebas-de-vida.component';

describe('PruebasDeVidaComponent', () => {
  let component: PruebasDeVidaComponent;
  let fixture: ComponentFixture<PruebasDeVidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PruebasDeVidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PruebasDeVidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
