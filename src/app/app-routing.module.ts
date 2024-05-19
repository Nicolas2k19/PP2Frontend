import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { RestriccionesComponent } from './components/restricciones/restricciones.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';
import { IncidenciasComponent } from './components/incidencias/incidencias.component';
import { PruebasDeVidaComponent } from './components/pruebas-de-vida/pruebas-de-vida.component';
import { AdministrarRestriccionesComponent } from './components/administrar-restricciones/administrar-restricciones.component';
import { AdministrarUsuariosComponent } from './components/administrar-usuarios/administrar-usuarios.component';
import { AdministrarPersonasComponent } from './components/administrar-personas/administrar-personas.component';
import { RutinasComponent } from './components/rutinas/rutinas.component';
import { RecuperarContrasenaComponent } from './components/recuperar-contrasena/recuperar-contrasena.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthSupervisorGuard } from './guards/auth-supervisor.guard';
import { AuthSupervisorGeneralGuard } from './guards/auth-supervisorGeneral.guard';
import { AuthAdministrativoGuard } from './guards/auth-administrativo.guard';
import { EstadoComponent } from './components/estado/estado.component';
import { SupervisorGeneralComponent } from './components/supervisor-general/supervisor-general';

const routes: Routes = [
  {
    path: 'inicio',
    component : InicioComponent, canActivate : [ AuthGuard ],
    children:
    [
      { path: '', redirectTo: 'notificaciones', pathMatch: 'full' },
      { path: 'restricciones', component: RestriccionesComponent, canActivate : [ AuthAdministrativoGuard ]},
      { path: 'notificaciones', component: NotificacionesComponent, canActivate : [ AuthAdministrativoGuard ]},
      { path: 'incidencias', component: IncidenciasComponent, canActivate : [ AuthAdministrativoGuard ]},
      { path: 'pruebasDeVida', component: PruebasDeVidaComponent, canActivate : [ AuthAdministrativoGuard ]},
      { path: 'rutinas', component: RutinasComponent, canActivate : [ AuthAdministrativoGuard ]},
      { path: 'administrarPersonas', component: AdministrarPersonasComponent, canActivate : [ AuthSupervisorGuard ] },
      { path: 'administrarUsuarios', component: AdministrarUsuariosComponent, canActivate : [ AuthSupervisorGuard ] },
      { path: 'supervisorGeneral', component: SupervisorGeneralComponent, canActivate : [ AuthSupervisorGeneralGuard ] },
      { path: 'administrarRestricciones', component: AdministrarRestriccionesComponent, canActivate : [ AuthSupervisorGuard ] },
      { path: 'recuperarContrasena', component: RecuperarContrasenaComponent },
      {path:'estado', component:EstadoComponent}
    ]
  },
  { path: 'ingresar', component: UsuarioComponent },
  { path: '', redirectTo: '/ingresar', pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
