import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarRestriccionesComponent } from './administrar-restricciones.component';

describe('AdministrarRestriccionesComponent', () => {
  let component: AdministrarRestriccionesComponent;
  let fixture: ComponentFixture<AdministrarRestriccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrarRestriccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarRestriccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
