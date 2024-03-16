import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarPersonasComponent } from './administrar-personas.component';

describe('AdministrarPersonasComponent', () => {
  let component: AdministrarPersonasComponent;
  let fixture: ComponentFixture<AdministrarPersonasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministrarPersonasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarPersonasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
