import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarRestriccionesMultiplesPersonaComponent } from './administrar-restricciones-multiples-persona.component';

describe('AdministrarRestriccionesMultiplesPersonaComponent', () => {
  let component: AdministrarRestriccionesMultiplesPersonaComponent;
  let fixture: ComponentFixture<AdministrarRestriccionesMultiplesPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarRestriccionesMultiplesPersonaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministrarRestriccionesMultiplesPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
