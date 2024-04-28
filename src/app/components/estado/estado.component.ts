import { Component, OnInit } from '@angular/core';
import { NgForm,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/login/usuario.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-estado',
  templateUrl: './estado.component.html',
  styleUrl: './estado.component.css'
})
export class EstadoComponent implements OnInit{
  estados : string[]
  estadoSeleccionado : string
  estadoActual : string
  usuarioActual : Usuario;
  usuariosGrupo : Usuario[]


  constructor(public usuarioService : UsuarioService, public toast : ToastrService){
    this.estados = ['AUSENTE','CONECTADO','FUERA_OFICINA','VACACIONES','LICENCIA'];
  }
  ngOnInit(): void {
      this.usuarioService.getUsuarioByEmail(this.recuperarEmailUsuario()).subscribe(user => {
      this.usuarioActual = user as Usuario;
      this.estadoActual = user.estadoUsuario
      this.obtenerMiembrosGrupo();

      
    });

   

    

    }
  /**
   * Actualiza el estado de un administrativo según el formulario pasado como parametro
   * @param formEstado 
   */
  actualizarEstado(formEstado : NgForm){
    console.log(this.estadoSeleccionado)
    this.estadoActual = this.estadoSeleccionado;
    
    
    this.usuarioService.getUsuarioByEmail(this.recuperarEmailUsuario()).subscribe(
     usuario => {
      usuario.estadoUsuario = formEstado.value.estadoSeleccionado;
      this.usuarioService.putUsuario(usuario).subscribe(e =>{
        this.toast.success("Se ha actulizado el estado correctamente")
      })
    
    })
     

  }
  /**
   * Recupera y retorna el email de la sesión actual
   * @returns 
   */
  recuperarEmailUsuario(){
    return localStorage.getItem('emailUsuario');
  }


  /**
   * Obtiene a los miembros del grupo perteneciente al usuario
   * @author Nicolás
   */
  obtenerMiembrosGrupo(){
    console.log("Hola estoy ejecutando la funcion "+this.usuarioActual.idGrupo )

    this.usuarioService.getUsuariosPorIdGrupo(this.usuarioActual.idGrupo).subscribe(
      users => {
        console.log("Hola soy yo te devuelvo un objeto?")
        console.log(users)
        this.usuariosGrupo = users as Usuario[];
      }


    );
  }
 



}
