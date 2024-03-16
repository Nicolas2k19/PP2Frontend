import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestriccionesComponent } from './restricciones.component';

describe('RestriccionesComponent', () => {
  let component: RestriccionesComponent;
  let fixture: ComponentFixture<RestriccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestriccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RestriccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
