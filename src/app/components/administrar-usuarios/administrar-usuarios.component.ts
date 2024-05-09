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

  grupoSeleccionado: Number
  editarBandera: boolean = false;
  grupos: Number[];
  nombreGrupo: string;
  grupoSelec: any;


  //Filtros
  grupoFilter: number;
  selectedOptionRol: string;
  selectedOptionEstado: string;


  //ordenamiento
  contadorU = 0;
  contadorE = 0;
  contadorR = 0;
  contadorG = 0;
  ordenID: boolean;
  ordenUsuario: boolean;
  ordenTipo:boolean;
  ordenGrupo:boolean;
  ordenEstado :boolean;


  constructor(
    public usuarioService: UsuarioService,
    public grupoService: GrupoService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    this.roles = ['SUPERVISOR', 'ADMINISTRATIVO'];
    this.grupos = []
    this.ordenGrupo=false;
    this.ordenID=false;
    this.ordenTipo=false;
    this.ordenUsuario=false;
    this.ordenEstado =false;
  }

  ngOnInit() {
    this.getUsuarios();
    this.hayError = false;
    this.editarBandera = false;
    this.usuarioSeleccionado = new Usuario;
    this.grupoService.getGrupos()
      .subscribe(grupo => {
        (grupo as []).forEach(grupo => {
          let grupoRetornado: Grupo = grupo as Grupo;
          this.grupos.push(grupoRetornado.idGrupo)
        })

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

  filtrar() {

    if (this.selectedOptionRol == null && this.selectedOptionEstado == null) {

      console.log('filtrando x grupo');

      this.filtraridGrupo();

    } if (this.grupoFilter == null && this.selectedOptionEstado == null) {

      console.log('filtrando x rol');

      switch (this.selectedOptionRol) {

        case 'supervisor':
          this.filtrarRolSupervisor();
          break;
        case 'administrativo':
          this.filtrarRolAdministrativo();
          break;
        case 'todos':
          this.getUsuarios();
          this.toggleSelect();
          this.selectedOptionRol = null;
          break;
        default:
          console.log('Opción no válida');
      }

    }

    else {

      console.log('filtrando x estado');

      switch (this.selectedOptionEstado) {

        case 'conectado':
          this.filtrarEstadoConectado();
          break;
        case 'ausente':
          this.filtrarEstadoAusente();
          break;
        case 'fuera de oficina':
          this.filtrarEstadoFuera();
          break;
        case 'vacaciones':
          this.filtrarEstadoVacaciones();
          break;
        case 'licencia':
          this.filtrarEstadoLicencia();
          break;
        case 'todos':
          this.getUsuarios();
          this.selectedOptionEstado = null;
          this.toggleSelect();
          break;
        default:
          console.log('Opción no válida');

      }

    }

  }

  //FILTROS DE ESTADOS

  filtrarEstadoConectado() {

    this.usuarioService.filtrarEstado("CONECTADO").subscribe(res => {
      this.spinner.hide();
      this.usuarioService.usuarios = res as Usuario[];
      this.toggleSelect();
      console.log(res);
    });

    this.selectedOptionEstado = null;
  }
  filtrarEstadoAusente() {

    this.usuarioService.filtrarEstado("AUSENTE").subscribe(res => {
      this.spinner.hide();
      this.usuarioService.usuarios = res as Usuario[];
      this.toggleSelect();
      console.log(res);
    });
    this.selectedOptionEstado = null;
  }
  filtrarEstadoFuera() {

    this.usuarioService.filtrarEstado("FUERA_OFICINA").subscribe(res => {
      this.spinner.hide();
      this.usuarioService.usuarios = res as Usuario[];
      this.toggleSelect();
      console.log(res);
    });
    this.selectedOptionEstado = null;
  }
  filtrarEstadoVacaciones() {

    this.usuarioService.filtrarEstado("VACACIONES").subscribe(res => {
      this.spinner.hide();
      this.usuarioService.usuarios = res as Usuario[];
      this.toggleSelect();
      console.log(res);
    });
    this.selectedOptionEstado = null;
  }
  filtrarEstadoLicencia() {

    this.usuarioService.filtrarEstado("LICENCIA").subscribe(res => {
      this.spinner.hide();
      this.usuarioService.usuarios = res as Usuario[];
      this.toggleSelect();
      console.log(res);
    });
    this.selectedOptionEstado = null;
  }


  //FILTROS DE ROLES

  filtrarRolSupervisor() {

    this.usuarioService.filtrarRol("SUPERVISOR").subscribe(res => {
      this.spinner.hide();
      this.usuarioService.usuarios = res as Usuario[];
      this.toggleSelect();
      console.log(res);
    });
    this.selectedOptionRol = null;
  }

  filtrarRolAdministrativo() {

    this.usuarioService.filtrarRol("ADMINISTRATIVO").subscribe(res => {
      this.spinner.hide();
      this.usuarioService.usuarios = res as Usuario[];
      this.toggleSelect();
      console.log(res);
    });
    this.selectedOptionRol = null;
  }


  //FILTRO DE GRUPO

  filtraridGrupo() {

    console.log("filtrar x id grupo")


    this.usuarioService.getUsuarioByGrupo(this.grupoFilter).subscribe(res => {
      this.spinner.hide();
      this.usuarioService.usuarios = res as Usuario[];
      this.toggleSelect();
      console.log(res);
    });

    this.grupoFilter = null;
  }



  toggleSelect() {
    this.showSelect = !this.showSelect;
  }


  ordenarPorIDUser(){

    let orden : number = this.ordenID ?  1:-1

    this.usuarioService.usuarios.sort((a,b)=>{
      if(a.idUsuario > b.idUsuario){
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenID = !this.ordenID;
  }

  ordenarPorUsuario() {

    let orden : number = this.ordenUsuario ?  1:-1

    this.usuarioService.usuarios.sort((a,b)=>{
      if(a.email > b.email){
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenUsuario = !this.ordenUsuario;

  }


  ordenarPorEstado() {
    let orden : number = this.ordenEstado ?  1:-1

    this.usuarioService.usuarios.sort((a,b)=>{
      if(a.estadoUsuario > b.estadoUsuario){
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenEstado = !this.ordenEstado;
    
  }


  ordenarPorRol() {
    let orden : number = this.ordenTipo ?  1:-1

    this.usuarioService.usuarios.sort((a,b)=>{
      if(a.rolDeUsuario > b.rolDeUsuario){
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenTipo = !this.ordenTipo;

  }


  ordenarPorGrupo() {
    let orden : number = this.ordenGrupo ?  1:-1

    this.usuarioService.usuarios.sort((a,b)=>{
      if(a.idGrupo > b.idGrupo){
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenGrupo = !this.ordenGrupo;

    
  }

  getNombreGrupo(idGrupo: number): string {

    return this.grupoService.getNombreGrupo(idGrupo);
  }
}
