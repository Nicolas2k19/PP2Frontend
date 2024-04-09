import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/login/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { NgForm } from '@angular/forms';
import { ErrorDTO } from 'src/app/models/error-dto';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import GrupoService from 'src/app/services/grupo/grupoService';
import Grupo from 'src/app/models/grupo/Grupo';

@Component({
  selector: 'app-administrar-usuarios',
  templateUrl: './administrar-usuarios.component.html',
  styleUrls: ['./administrar-usuarios.component.css']
})
export class AdministrarUsuariosComponent implements OnInit {

  roles;
  rolSeleccionado;
  hayError;
  usuarioSeleccionado = new Usuario;
  showSelect: boolean = false;
  selectedOption: string;
  grupoSeleccionado : Number
  editarBandera: boolean = false;
  grupos : Number[];



  constructor(
    public usuarioService: UsuarioService,
    public grupoService : GrupoService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    this.roles = ['SUPERVISOR', 'ADMINISTRATIVO'];
    this.grupos = []
  }

  ngOnInit() {
    this.getUsuarios();
    this.hayError = false;
    this.editarBandera = false;
    this.usuarioSeleccionado = new Usuario;
    this.grupoService.getGrupos()
              .subscribe(grupo => {  
                (grupo as []).forEach(grupo => {
                  let grupoRetornado : Grupo = grupo as Grupo;
                  this.grupos.push(grupoRetornado.idGrupo)})
               
                  console.log(this.grupos)
                });
  }

  getUsuarios() {
    this.spinner.show();
    this.usuarioService.getUsuarios()
      .subscribe(res => {
        this.spinner.hide();
        this.usuarioService.usuarios = res as Usuario[];
        console.log(res);
      })
  }

  agregarUsuario(usuarioForm: NgForm) {
    this.spinner.show();
    //EDITO SI LA BANDERA ES TRUE
    if (this.editarBandera == true) {
      this.usuarioSeleccionado.rolDeUsuario = this.rolSeleccionado;
      this.usuarioSeleccionado.idGrupo = this.grupoSeleccionado;
      console.log(this.usuarioSeleccionado)
      this.usuarioService.putUsuario(this.usuarioSeleccionado)
        .subscribe(res => {
          this.spinner.hide();
          this.toastr.success('Usuario modificado correctamente', 'Modificado!');
          this.getUsuarios();
          usuarioForm.reset();
          this.editarBandera = false;
          this.usuarioSeleccionado = new Usuario;
        });
    }
    //GUARDO SI LA BANDERA ES FALSE
    else {
      this.usuarioSeleccionado.rolDeUsuario = this.rolSeleccionado;
      this.usuarioSeleccionado.idGrupo = this.grupoSeleccionado;
      //POR AHORA ESTA POR DEFECTO ESTA CONTRASEÑA EN EL MODEL
      this.usuarioService.postUsuario(this.usuarioSeleccionado)
        .subscribe(res => {
          this.spinner.hide();
          var error = res as ErrorDTO;
          if (error.hayError) {
            //MOSTRAR ERROR
            this.editarBandera = false;
          }
          else {
            this.toastr.success('Usuario agregado correctamente', 'Agregado!');
            this.getUsuarios();
            usuarioForm.reset();
            this.editarBandera = false;
            this.usuarioSeleccionado = new Usuario;
          }
        });
    }
  }

  editarUsuario(usuario: Usuario) {
    this.usuarioSeleccionado = usuario;
    this.rolSeleccionado = usuario.rolDeUsuario;
    this.editarBandera = true;
  }

  eliminarUsuario(idUsuario: number) {
    this.spinner.show();
    this.usuarioService.deleteUsuario(idUsuario)
      .subscribe(res => {
        this.spinner.hide();
        var error = res as ErrorDTO;
        if (error.hayError) {
          //MOSTRAR ERROR
          this.toastr.error("" + error.mensajeError, "Error!");
        }
        else {
          this.toastr.success('Usuario eliminado correctamente', 'Eliminado!');
          this.getUsuarios();
        }
      });
  }

  //Filtros

  filtrar(){

    console.log("filtrando")
    console.log(this.selectedOption);
    switch (this.selectedOption) {
      case 'conectado':
        this.filtrarEstadoConectado();
        break;
      case 'ausente':
        this.filtrarEstadoAusente();
        break;
      case 'supervisor':
        this.filtrarRolSupervisor();
        break;
      case 'administrativo':
        this.filtrarRolAdministrativo();
        break;
      case 'todos':
        this.getUsuarios();
        this.toggleSelect();
        break;
      default:
        console.log('Opción no válida');
    }

  }


  filtrarEstadoConectado(){

    this.usuarioService.filtrarEstado("CONECTADO").subscribe(res => {
        this.spinner.hide();
        this.usuarioService.usuarios = res as Usuario[];
        this.toggleSelect();
        console.log(res);
      });
  }
  filtrarEstadoAusente(){

    this.usuarioService.filtrarEstado("AUSENTE").subscribe(res => {
        this.spinner.hide();
        this.usuarioService.usuarios = res as Usuario[];
        this.toggleSelect();
        console.log(res);
      });
  }

  filtrarRolSupervisor(){

    this.usuarioService.filtrarRol("SUPERVISOR").subscribe(res => {
        this.spinner.hide();
        this.usuarioService.usuarios = res as Usuario[];
        this.toggleSelect();
        console.log(res);
      });
  }

  filtrarRolAdministrativo(){

    this.usuarioService.filtrarRol("ADMINISTRATIVO").subscribe(res => {
        this.spinner.hide();
        this.usuarioService.usuarios = res as Usuario[];
        this.toggleSelect();
        console.log(res);
      });
  }
  
  toggleSelect() {
    this.showSelect = !this.showSelect;
  }


}
