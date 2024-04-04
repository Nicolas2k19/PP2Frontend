import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/login/usuario.service';



@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrl: './estado.component.css'
})
export class EstadoComponent implements OnInit{
  estados : string[]
  estadoSeleccionado : string
  estadoActual : string


  constructor(public usuarioService : UsuarioService ){
    this.estados = ['AUSENTE','CONECTADO','FUERA_OFICINA','VACACIONES','LICENCIA'];
  }
  ngOnInit(): void {
     this.usuarioService.getUsuarioByEmail(this.recuperarEmailUsuario()).subscribe(user => this.estadoActual = user.estadoUsuario);
    }
  /**
   * Actualiza el estado de un administrativo según el formulario pasado como parametro
   * @param formEstado 
   */
  actualizarEstado(formEstado : NgForm){
    console.log(this.estadoSeleccionado)
    this.estadoActual = this.estadoSeleccionado;
    this.usuarioService.
    getUsuarioByEmail(this.recuperarEmailUsuario()).subscribe(
     usuario => {
      usuario.estadoUsuario = formEstado.value.estadoSeleccionado;
      this.usuarioService.putUsuario(usuario).subscribe(e =>{})
    
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
