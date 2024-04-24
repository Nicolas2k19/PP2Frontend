import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarRestriccionesFisicasComponent } from './administrar-restricciones-fisicas.component';

describe('AdministrarRestriccionesFisicasComponent', () => {
  let component: AdministrarRestriccionesFisicasComponent;
  let fixture: ComponentFixture<AdministrarRestriccionesFisicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarRestriccionesFisicasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministrarRestriccionesFisicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
