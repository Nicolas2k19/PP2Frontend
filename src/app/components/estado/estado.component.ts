import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/login/usuario.service';
import {tap} from "rxjs/operators";


@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrl: './estado.component.css'
})
export class EstadoComponent{
  estados : string[]
  estadoSeleccionado : string
  constructor(public usuarioService : UsuarioService ){
    this.estados = ['AUSENTE','CONECTADO','FUERA_OFICINA','VACACIONES','LICENCIA'];
  }
  /**
   * Actualiza el estado de un administrativo según el formulario pasado como parametro
   * @param formEstado 
   */
  actualizarEstado(formEstado : NgForm){
    console.log(this.estadoSeleccionado)
    this.usuarioService.
    getUsuarioByEmail(this.recuperarEmailUsuario())
    .pipe(tap(user =>{user.estado = this.estadoSeleccionado;}))
    .subscribe(user =>{
      this.usuarioService.putUsuario(user);
    })
     

  }
  /**
   * Recupera y retorna el email de la sesión actual
   * @returns 
   */
  recuperarEmailUsuario(){
    return localStorage.getItem('emailUsuario');
  }
 



}
