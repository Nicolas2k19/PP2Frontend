import { Component, OnInit} from '@angular/core';
import { Persona } from 'src/app/models/persona';
import { Usuario } from 'src/app/models/usuario';
import { Restriccion } from 'src/app/models/restriccion';
import { NgForm} from '@angular/forms';
import { RestriccionService } from 'src/app/services/restricciones/restriccion.service';
import { PersonaService } from 'src/app/services/personas/persona.service';
import { UsuarioService } from 'src/app/services/login/usuario.service';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import { ErrorDTO } from 'src/app/models/error-dto';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import GrupoService from 'src/app/services/grupo/grupoService';
import Grupo from 'src/app/models/grupo/Grupo';
import GrupoNuevo from 'src/app/models/grupo/grupoNuevo';
import { AdministrarRestriccionesFisicasComponent } from '../administrar-restricciones-fisicas/administrar-restricciones-fisicas.component';

@Component({
  selector: 'app-administrar-restricciones',
  templateUrl: './administrar-restricciones.component.html',
  styleUrls: ['./administrar-restricciones.component.css'],
  
})

export class AdministrarRestriccionesComponent implements OnInit {
  damnificada = new Persona;
  victimario = new Persona;
  administrativo = new Usuario;
  restriccion = new Restriccion;


  restriccionFisica : boolean
  errorCampos: Boolean
  errorCampoDamnificada: Boolean

  camposIncompletos = false;
  fecha: Date = new Date();
  maxDatePicker = { year: this.fecha.getFullYear(), month: this.fecha.getMonth() + 1, day: this.fecha.getDate() };
  editarBandera: boolean = false;
  showSelect: boolean = false;
  grupos: Number[];
  grupoSeleccionado: Number
  grupoActual: Grupo


  particionesGrupo: Grupo[]
  usuariosDelGrupo: Usuario[]
  restriccionesDelGrupo: Restriccion[]
  mostrarAbmRestricciones: boolean;
  mostrarGrupoRestricciones: boolean;
  mostrarGrupo: boolean


  //filtros
  emailFilter: string;
  grupoFilter: number;
  dniFilterDamnificada: string;
  dniFilterVictimario: string;
  idFilterDamnificada: number;
  idFilterVictimario: number;
  //ordenamiento
  contadorA = 0;
  contadorV = 0;
  contadorD = 0;
  contadorGR = 0;

  //ventana modal

  modalAbierta: boolean = false;
  infoResId: number;
  infoDamnificadaNombre: string;
  infoDamnificadaDNI: string;
  infoVictimarioNombre: string;
  infoVictimarioDNI: string;
  infoResFecha: Date;
  infoResAdmin: string;
  infoResDistancia: number;


  turnoGrupo: String
  nombreEquipo: String

  errorTextoEquipo: boolean
  errorTurno: boolean


  nombreGrupoAAsignar: String;
  errorCampoVictimario: boolean;
  errorCampoSelectorGrupo: boolean
  errorCampoFecha: boolean
  errorCampoDistancia: boolean

  constructor(
    public restriccionService: RestriccionService,
    public grupoService: GrupoService,
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    this.grupos = [];
    this.usuariosDelGrupo = []
    this.restriccionesDelGrupo = []

    this.mostrarAbmRestricciones = true;
    this.mostrarGrupo = false;
    this.mostrarGrupoRestricciones = false
    this.turnoGrupo = ""
    this.nombreEquipo = ""
    this.nombreGrupoAAsignar = ""
    this.errorCampoDamnificada = false;
    this.errorCampoVictimario = false;
    this.errorCampoSelectorGrupo = false;
    this.errorCampoFecha = false;
    this.errorTextoEquipo = false
    this.errorTurno = false;
    this.restriccionFisica = false;
  }



  ngOnInit() {
    this.getRestricciones();
    this.restriccion.distancia = 200;
    this.editarBandera = false;
    this.grupoService.getGrupos()
      .subscribe(grupo => {
        (grupo as []).forEach(grupo => {
          let grupoRetornado: Grupo = grupo as Grupo;
          this.grupos.push(grupoRetornado.idGrupo)
        })
      }
      );

  }


  /**
   * Asigna un grupo a la perimetral a crear
   */
  asignarGrupoPerimetral() {
    this.spinner.show();
    this.grupoService.getGrupoByNombre(this.nombreGrupoAAsignar)
      .subscribe(res => {
        this.spinner.hide();
        if (res == null) {
          this.toastr.error("Verificar el email de usuario ingresado.", "Error!");
          this.setCamposIncompletos();
          return;
        }
        this.grupoActual = res as Grupo;
        document.getElementById("labelAdministrativo").innerHTML =
          "Grupo: " + this.nombreGrupoAAsignar;
      })

  }


  /**Crea un nuevo grupo! */
  crearGrupo() {
    this.eliminarErrorGrupo()
    this.spinner.show();
    if (this.hayError()) {
      this.toastr.error("Uno de los campos no ha sido completado", "Error!");
      this.spinner.hide();
      return
    };

    let grupo: GrupoNuevo = new GrupoNuevo
    grupo.turnoGrupo = this.turnoGrupo
    grupo.nombreGrupo = this.nombreEquipo

    try {
      this.grupoService.crearEquipo(grupo).subscribe(res => {
        console.log(res);
        this.toastr.success("¡Se agrego el nuevo equipo!")
        this.spinner.hide();

      });
    }
    catch (error) {
      this.toastr.error("No se pudo crear el equipo, intente nuevamente.", "Error!")
      this.spinner.hide();
    }

  }

  /**
   * Si hay un error retorna true y setea el campo con error a true
   * @returns 
   */
  private hayError() {
    if (this.nombreEquipo.length == 0) {
      this.errorTextoEquipo = true;
      return true
    }
    if (this.turnoGrupo.length == 0) {
      this.errorTurno = true;
      return true
    }

    return false
  }

  /**
   * Elimina el error del formulario de grupos
   */
  private eliminarErrorGrupo() {
    this.errorTextoEquipo = false;
    this.errorTurno = false;
  }



  /**
   * Obtiene un grupo en base a lo seleccionado por el selector de grupo en administrar-restricciones-component-html 
   */
  getGrupo() {
    this.usuariosDelGrupo = []
    this.restriccionesDelGrupo = []
    this.grupoService.getGrupo(this.grupoSeleccionado)
      .subscribe(grupo => {
        this.grupoActual = grupo as Grupo
        this.mostrarGrupo = true;
        this.grupoService.getGruposByID(this.grupoActual.idGrupo).subscribe(particionCompleta => {
          this.particionesGrupo = particionCompleta as Grupo[]
          this.particionesGrupo.forEach(grupo => {
            this.usuarioService.getUsuarioByGrupo(grupo.idGrupo).subscribe(user => { this.usuariosDelGrupo = (user as Usuario[]) });
            this.restriccionService.getByidGrupo(grupo.idGrupo).subscribe(restriccion => { this.restriccionesDelGrupo = (restriccion as Restriccion[]) });
          });


        })






      });
  }
  /**
   * Obtiene todas las restricciones
   */
  getRestricciones() {
    this.spinner.show();
    this.restriccionService.getRestricciones()
      .subscribe(res => {
        this.spinner.hide();
        this.restriccionService.restricciones = res as RestriccionDTO[];
        console.log(res);
      })
  }

  /**
   * Agrega el victimario, retorna un booleano indicando si la operación de agregar fue exitosa
   * @returns boolean
   */
  agregarVictimario() {
    if (this.stringVacio(this.victimario.dni)) {
      this.setErrorCampoVictimario();
      this.toastr.error("Verificar el DNI de victimario ingresado.", "Error!");
      return false;
    }
    this.personaService.getVictimarioByDNI(this.victimario.dni)
      .subscribe(res => {
        if (res == null) {
          this.toastr.error("Verificar el DNI de victimario ingresado.", "Error!");
          this.setErrorCampoVictimario();
          return false;
        }
        this.victimario = res;
        return true;
      })

  }

  /**
   * Agrega a la damnificada, retorna un booleano indicando si la operación de agregar fue exitosa
   * @returns boolean
   */
  agregarDamnificada() {
    console.log(this.damnificada.dni)
    if (this.stringVacio(this.damnificada.dni)) {
      this.setErrorCampoDamnificada();
      this.toastr.error("Verificar el DNI de damnificada ingresado.", "Error!");
      return false;
    }
    this.personaService.getDamnificadaByDNI(this.damnificada.dni)
      .subscribe(res => {
        if (res == null) {
          this.toastr.error("Verificar el DNI de damnificada ingresado.", "Error!");
          this.setErrorCampoDamnificada();
          return false;
        }
        this.damnificada = res;
        return true;
      })


  }





  agregarAdministrativo() {
    this.spinner.show();
    this.usuarioService.getUsuarioByEmail(this.administrativo.email)
      .subscribe(res => {
        this.spinner.hide();
        if (res == null) {
          this.toastr.error("Verificar el email de usuario ingresado.", "Error!");
          this.setCamposIncompletos();
          return;
        }
        this.administrativo = res;
        document.getElementById("labelAdministrativo").innerHTML =
          "Administrativo: " + this.administrativo.email;
      })
  }

  guardarRestriccion(restriccionForm: NgForm) {
    if (this.editarBandera == true) {
      this.restriccion.idDamnificada = this.damnificada.idPersona;
      this.restriccion.idVictimario = this.victimario.idPersona;
      this.restriccion.idGrupo = this.grupoSeleccionado;

      let ngbDate = restriccionForm.value.dp;
      let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
      this.restriccion.fechaSentencia = myDate;

      if (this.restriccion.idDamnificada == 0 || this.restriccion.idVictimario == 0
        || this.restriccion.idDamnificada == 0) {
        this.toastr.error("Completar todos los campos", "Error!");
        this.setCamposIncompletos();
      }
      else {
        this.spinner.show();
        this.restriccionService.putRestriccion(this.restriccion)
          .subscribe(res => {
            console.log(res)
            this.spinner.hide();
            this.toastr.success("La restricción se modificó correctamente", "Modificada!");
            restriccionForm.reset();
            this.getRestricciones();
            document.getElementById("labelVictimario").innerHTML = "";
            document.getElementById("labelDamnificada").innerHTML = "";
            document.getElementById("labelAdministrativo").innerHTML = "";
            this.victimario = new Persona;
            this.damnificada = new Persona;
            this.administrativo = new Usuario;
            this.editarBandera = false;
            this.eliminarErroresCampos()
          })
      }
    }
    else {
      this.agregarRestriccion(restriccionForm);
    }
  }

  agregarRestriccion(restriccionForm: NgForm) {
    if (this.agregarDamnificada() == false || this.agregarVictimario() == false) {
      return
    }

    if (this.grupoSeleccionado == null) {
      this.setErrorCampoGrupo();
      this.toastr.error("Seleccione un grupo", "Error!");
      return
    }

    if (restriccionForm.value.dp == null) {
      this.setErrorCampoFecha();
      this.toastr.error("Seleccione la fecha de inicio de la restricción", "Error!");
      return
    }

    if (this.restriccion.distancia < 0) {
      this.setErrorCampoDistancia();
      this.toastr.error("La distancia ingresada es invalida", "Error!");
      return
    }

    this.restriccion.idDamnificada = this.damnificada.idPersona;
    this.restriccion.idVictimario = this.victimario.idPersona;
    this.restriccion.idGrupo = this.grupoSeleccionado;



    let ngbDate = restriccionForm.value.dp;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    this.restriccion.fechaSentencia = myDate;


    if (this.restriccion.idDamnificada == 0 || this.restriccion.idVictimario == 0
      || this.restriccion.idDamnificada == 0) {
      this.toastr.error("Completar todos los campos", "Error!");
      this.setCamposIncompletos();
    }
    else {
      this.spinner.show();
      this.restriccionService.postRestriccion(this.restriccion)
        .subscribe(res => {
          this.spinner.hide();
          var error = res as ErrorDTO;
          if (error.hayError) {
            //MOSTRAR ERROR
            this.toastr.error("" + error.mensajeError, "Error!");
            this.setCamposIncompletos();
          }
          else {
            this.eliminarErroresCampos()
            this.toastr.success("La restricción se agrego correctamente", "Agregada!");
            restriccionForm.reset();
            this.getRestricciones();
            this.victimario = new Persona;
            this.damnificada = new Persona;
            this.administrativo = new Usuario;
            this.restriccion = new Restriccion;
            this.restriccion.distancia = 200;
          }
        })
    }
  }

  confirm() {
    if (window.confirm("Are you sure to delete ")) {
      console.log("eliminar restriccion");
    }
  }


  editarRestriccion(restriccionDTO: RestriccionDTO) {
    this.restriccion = restriccionDTO.restriccion;
    this.victimario = restriccionDTO.victimario;
    this.damnificada = restriccionDTO.damnificada;
    this.administrativo = restriccionDTO.administrativo;
  }

  eliminarRestriccion(restriccionDTO: RestriccionDTO) {
    if (window.confirm("Are you sure to delete ")) {
      this.spinner.show();
      this.restriccionService.deleteRestriccion(restriccionDTO.restriccion.idRestriccion)
        .subscribe(res => {
          this.spinner.hide();
          this.getRestricciones();
          document.getElementById("labelVictimario").innerHTML = "";
          document.getElementById("labelDamnificada").innerHTML = "";
          document.getElementById("labelAdministrativo").innerHTML = "";
          this.victimario = new Persona;
          this.damnificada = new Persona;
          this.administrativo = new Usuario;
          this.restriccion = new Restriccion;
        });
    }

  }

  masInfo(restriccionDTO: RestriccionDTO) {

    this.infoResId = restriccionDTO.restriccion.idRestriccion;
    this.infoDamnificadaNombre = restriccionDTO.damnificada.nombre + " " + restriccionDTO.damnificada.apellido;
    this.infoDamnificadaDNI = restriccionDTO.damnificada.dni;
    this.infoVictimarioNombre = restriccionDTO.victimario.nombre + " " + restriccionDTO.victimario.apellido;
    this.infoVictimarioDNI = restriccionDTO.victimario.dni;
    this.infoResFecha = restriccionDTO.restriccion.fechaSentencia;
    this.infoResAdmin = restriccionDTO.administrativo.email;
    this.infoResDistancia = restriccionDTO.restriccion.distancia;



    this.modalAbierta = true;
  }


  cerrarModal() {

    this.modalAbierta = false;
  }


  //filtros

  filtrarDamnificada() {

    this.personaService.getDamnificadaByDNI(this.dniFilterDamnificada).subscribe(res => {
      this.damnificada = res;
      this.idFilterDamnificada = this.damnificada.idPersona;
      this.restriccionService.getRestriccionesDamnificada(this.idFilterDamnificada).subscribe(res => {
        this.spinner.hide();
        this.restriccionService.restricciones = res as RestriccionDTO[];
      });
    })

  }


  filtrarVictimario() {

    this.personaService.getVictimarioByDNI(this.dniFilterVictimario).subscribe(res => {
      this.victimario = res;
      this.idFilterVictimario = this.victimario.idPersona;
      this.restriccionService.getRestriccionesVictimario(this.idFilterVictimario).subscribe(res => {
        this.spinner.hide();
        this.restriccionService.restricciones = res as RestriccionDTO[];
      });
    })

  }


  filtrarAdministrativo() {
    this.restriccionService.getRestriccionesAdministrativo(this.emailFilter).subscribe(res => {
      this.spinner.hide();
      this.restriccionService.restricciones = res as RestriccionDTO[];
      console.log(res);
      this.dniFilterDamnificada = null;
      this.dniFilterVictimario = null;
    });
  }

  filtrarGrupo() {
    this.restriccionService.getRestriccionesGrupo(this.grupoFilter).subscribe(res => {
      this.spinner.hide();
      this.restriccionService.restricciones = res as RestriccionDTO[];
      console.log(res);
      this.grupoFilter = null;
    });
  }



  //ordenamiento tabla restricciones

  ordenarPorAdministrativo() {
    if (this.contadorA == 0) {
      this.spinner.show();
      this.restriccionService.getRestricciones().subscribe(res => {
        this.restriccionService.restricciones = res as RestriccionDTO[];
        this.restriccionService.restricciones.sort((a, b) => {
          if (a.administrativo.email < b.administrativo.email) {
            return -1;
          }
          if (a.administrativo.email > b.administrativo.email) {
            return 1;
          }
          return 0;
        });

      });
      this.contadorA += 1;
      this.spinner.hide();
    } else {
      this.spinner.show();

      this.restriccionService.getRestricciones().subscribe(res => {
        this.restriccionService.restricciones = res as RestriccionDTO[];
        this.restriccionService.restricciones.sort((a, b) => {
          if (a.administrativo.email > b.administrativo.email) {
            return -1;
          }
          if (a.administrativo.email < b.administrativo.email) {
            return 1;
          }
          return 0;
        });
      });
      this.contadorA -= 1;
      this.spinner.hide();
    }
  }



  ordenarPorVictimario() {
    if (this.contadorV == 0) {
      this.spinner.show();
      this.restriccionService.getRestricciones().subscribe(res => {
        this.restriccionService.restricciones = res as RestriccionDTO[];
        this.restriccionService.restricciones.sort((a, b) => {
          if (a.victimario.dni < b.victimario.dni) {
            return -1;
          }
          if (a.victimario.dni > b.victimario.dni) {
            return 1;
          }
          return 0;
        });

      });
      this.contadorV += 1;
      this.spinner.hide();
    } else {
      this.spinner.show();
      this.restriccionService.getRestricciones().subscribe(res => {
        this.restriccionService.restricciones = res as RestriccionDTO[];
        this.restriccionService.restricciones.sort((a, b) => {
          if (a.victimario.dni > b.victimario.dni) {
            return -1;
          }
          if (a.victimario.dni < b.victimario.dni) {
            return 1;
          }
          return 0;
        });
      });
      this.contadorV -= 1;
      this.spinner.hide();
    }
  }

  ordenarPorGrupoR() {

    if (this.contadorGR == 0) {
      this.spinner.show();
      this.restriccionService.getRestricciones().subscribe(res => {
        this.restriccionService.restricciones = res as RestriccionDTO[];
        this.restriccionService.restricciones.sort((a, b) => {
          if (a.restriccion.idGrupo < b.restriccion.idGrupo) {
            return -1;
          }
          if (a.restriccion.idGrupo > b.restriccion.idGrupo) {
            return 1;
          }
          return 0;
        });

      });
      this.contadorGR += 1;
      this.spinner.hide();
    } else {
      this.spinner.show();
      this.restriccionService.getRestricciones().subscribe(res => {
        this.restriccionService.restricciones = res as RestriccionDTO[];
        this.restriccionService.restricciones.sort((a, b) => {
          if (a.restriccion.idGrupo > b.restriccion.idGrupo) {
            return -1;
          }
          if (a.restriccion.idGrupo < b.restriccion.idGrupo) {
            return 1;
          }
          return 0;
        });
      });
      this.contadorGR -= 1;
      this.spinner.hide();
    }
  }

  ordenarPorDamnificada() {

    if (this.contadorD == 0) {
      this.spinner.show();
      this.restriccionService.getRestricciones().subscribe(res => {
        this.restriccionService.restricciones = res as RestriccionDTO[];
        this.restriccionService.restricciones.sort((a, b) => {
          if (a.damnificada.dni < b.damnificada.dni) {
            return -1;
          }
          if (a.damnificada.dni > b.damnificada.dni) {
            return 1;
          }
          return 0;
        });

      });
      this.contadorD += 1;
      this.spinner.hide();
    } else {
      this.spinner.show();
      this.restriccionService.getRestricciones().subscribe(res => {
        this.restriccionService.restricciones = res as RestriccionDTO[];
        this.restriccionService.restricciones.sort((a, b) => {
          if (a.damnificada.dni > b.damnificada.dni) {
            return -1;
          }
          if (a.damnificada.dni < b.damnificada.dni) {
            return 1;
          }
          return 0;
        });
      });
      this.contadorD -= 1;
      this.spinner.hide();
    }

  }





  toggleSelect() {
    this.showSelect = !this.showSelect;
  }


  cambiarVista() {
    this.mostrarGrupoRestricciones = !this.mostrarGrupoRestricciones
    this.mostrarAbmRestricciones = !this.mostrarAbmRestricciones
    this.restriccionFisica = false
  }

  mostrarGrupos(){
    this.mostrarGrupoRestricciones = true
    this.mostrarAbmRestricciones = false
    this.restriccionFisica = false

  }
  mostrarRestriccionesFisicas(){
    this.mostrarGrupoRestricciones = false
    this.mostrarAbmRestricciones = false
    this.restriccionFisica = true

  }

  mostrarRestricciones(){
    this.mostrarGrupoRestricciones = false
    this.mostrarAbmRestricciones = true
    this.restriccionFisica = false
  }



  /**
   * Setea booleano que indica que hay errores a true
   */
  setCamposIncompletos(): void {
    this.errorCampos = true;
  }

  /**
   * Setea booleano que indica que hay  errores en el campo damnificada
   */
  setErrorCampoDamnificada() {
    this.errorCampoDamnificada = true;
  }

  /**
   * Setea booleano que indica que hay  errores en el campo victimario
   */
  setErrorCampoVictimario() {
    this.errorCampoVictimario = true;
  }

  /**
  * Setea booleano que indica que hay  errores en el campo grupo
  */
  setErrorCampoGrupo() {
    this.errorCampoSelectorGrupo = true;
  }
  /**
  * Setea booleano que indica que hay  errores en el campo fecha
  */
  setErrorCampoFecha() {
    this.errorCampoFecha = true;
  }

  /**
 * Setea booleano que indica que hay  errores en el campo fecha
 */
  setErrorCampoDistancia() {
    this.errorCampoDistancia = true;
  }

  /**
   * Elimina los errores en los campos del formulario
   */
  eliminarErroresCampos() {
    this.errorCampoVictimario = false;
    this.errorCampoSelectorGrupo = false;
    this.errorCampoFecha = false
    this.errorCampoDistancia = false
    this.errorCampoDamnificada = false;
  }

  /**
   * Verifica si el string campos estan vacíos
   */
  stringVacio(string: string) {
    console.log(string.length > 0)
    return string.length == 0

  }
}





