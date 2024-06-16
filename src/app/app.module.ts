import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { NavComponent } from './components/nav/nav.component';
import { RestriccionesComponent } from './components/restricciones/restricciones.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { IncidenciasComponent } from './components/incidencias/incidencias.component';
import { PruebasDeVidaComponent } from './components/pruebas-de-vida/pruebas-de-vida.component';
import { AdministrarRestriccionesComponent } from './components/administrar-restricciones/administrar-restricciones.component';
import { AdministrarUsuariosComponent } from './components/administrar-usuarios/administrar-usuarios.component';
import { AdministrarPersonasComponent } from './components/administrar-personas/administrar-personas.component';
import { EstadoComponent } from './components/estado/estado.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule} from '@angular/common/http';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RutinasComponent } from './components/rutinas/rutinas.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { AdministrarRestriccionesFisicasComponent } from './components/administrar-restricciones-fisicas/administrar-restricciones-fisicas.component';
import { AdministrarRestriccionesMultiplesPersonaComponent } from './components/administrar-restricciones-multiples-persona/administrar-restricciones-multiples-persona.component';
import { SupervisorGeneralComponent } from './components/supervisor-general/supervisor-general';
import { InformesComponent } from './components/informes/informes.component';
import { JuzgadoComponent } from './components/juzgado/juzgado.component';
import { ParametrosRutinaComponent } from './components/parametros-rutina/parametros-rutina.component';
import { ParametrosPruebaDeVidaComponent } from './components/parametros-prueba-de-vida/parametros-prueba-de-vida.component';



@NgModule({
  declarations: [
    AppComponent,
    UsuarioComponent,
    AdministrarRestriccionesFisicasComponent,
    AdministrarRestriccionesMultiplesPersonaComponent,
    InicioComponent,
    NavComponent,
    RestriccionesComponent,
    NotificacionesComponent,
    IncidenciasComponent,
    PruebasDeVidaComponent,
    AdministrarRestriccionesComponent,
    AdministrarUsuariosComponent,
    AdministrarPersonasComponent,
    SupervisorGeneralComponent,
    RutinasComponent,
    RecuperarContrasenaComponent,
    EstadoComponent, 
    InformesComponent,
    JuzgadoComponent,
    ParametrosRutinaComponent,
    ParametrosPruebaDeVidaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: false
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
