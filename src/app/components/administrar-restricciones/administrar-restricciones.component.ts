import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/models/persona';
import { Usuario } from 'src/app/models/usuario';
import { Restriccion } from 'src/app/models/restriccion';
import { NgForm } from '@angular/forms';
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
import { DetalleRestriccion } from 'src/app/models/detalle-restriccion';
import { JuzgadoService } from 'src/app/services/juzgado/juzgado.service';
import { Juzgado } from 'src/app/models/juzgado';
import { ComisariaService } from 'src/app/services/comisaria/comisaria.service';
import { Comisaria } from 'src/app/models/comisaria';
import { DetalleService } from 'src/app/services/detalle/detalle.service';

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
  restriccionMultiplePersona: boolean;

  //Para el detalle (cuando edito)

  detalle = new DetalleRestriccion;

  detalles: DetalleRestriccion[];

  //lista de comisarias

  comisarias: Comisaria[];

  //para agarrar la comisaria seleccionada

  comisariaSeleccionado: number;

  //lista de juzgados

  juzgados: Juzgado[];

  //para agarrar el juzgado seleccionado

  juzgadoSeleccionado: number;
  restriccionFisica: boolean
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
  ordenID: boolean;
  ordenAdmin: boolean;
  ordenDamnificada: boolean;
  ordenVictimario: boolean;
  ordenGrupo: boolean;

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
  originalRes: RestriccionDTO[] = [];
  errorCampoDetalle: boolean;
  errorCampoJuez: boolean;
  errorCampoSelectorComisaria: boolean
  errorCampoSelectorJuzgado: boolean
  infoResDetalle: string;
  infoResJuez: string;
  infoResComisaria: string;
  infoResJuzgado: string;
  banderaEdicion: boolean;

  constructor(
    public restriccionService: RestriccionService,
    public grupoService: GrupoService,
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private juzgadoService: JuzgadoService,
    private comisariaService: ComisariaService,
    private detalleService: DetalleService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    this.grupos = [];
    this.usuariosDelGrupo = [];
    this.restriccionesDelGrupo = [];
    this.mostrarAbmRestricciones = true;
    this.mostrarGrupo = false;
    this.mostrarGrupoRestricciones = false
    this.turnoGrupo = ""
    this.nombreEquipo = ""
    this.nombreGrupoAAsignar = ""
    this.errorCampoDamnificada = false;
    this.errorCampoVictimario = false;
    this.errorCampoDetalle = false;
    this.errorCampoJuez = false;
    this.errorCampoSelectorGrupo = false;
    this.errorCampoFecha = false;
    this.errorTextoEquipo = false
    this.errorTurno = false;
    this.restriccionFisica = false;
    this.restriccionMultiplePersona = false;

    this.ordenID = true;
    this.ordenAdmin = true;
    this.ordenDamnificada = true;
    this.ordenGrupo = true;
    this.ordenVictimario = true;
  }

  ngOnInit() {
    this.getRestricciones();
    this.restriccion.distancia = 200;
    this.editarBandera = false;
    this.grupoService.getGrupos().subscribe(grupo => {
      (grupo as []).forEach(grupo => {
        let grupoRetornado: Grupo = grupo as Grupo;
        this.grupos.push(grupoRetornado.idGrupo)
      })
    }
    );

    this.getJuzgados();
    this.getComisarias();
    this.getDetalles();
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

  getJuzgados() {
    this.spinner.show();
    this.juzgadoService.getJuzgados().subscribe(juzgado => {
      this.spinner.hide();
      this.juzgados = juzgado as Juzgado[];
    })
  }

  getComisarias() {
    this.spinner.show();
    this.comisariaService.getComisarias().subscribe(comisaria => {
      this.spinner.hide();
      this.comisarias = comisaria as Comisaria[];
    })
  }

  getDetalles() {
    this.spinner.show();
    this.detalleService.getDetalles().subscribe(detalle => {
      this.spinner.hide();
      this.detalles = detalle as DetalleRestriccion[];
    })
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
        this.originalRes = res as RestriccionDTO[];
      })
  }

  /**
   * Agrega el victimario, retorna un booleano indicando si la operación de agregar fue exitosa
   * @returns boolean
   */
  agregarVictimario(ngForm: NgForm) {
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
        this.victimario = res as Persona;
        this.agregarRestriccion(ngForm);
      })

  }

  /**
   * Agrega a la damnificada, retorna un booleano indicando si la operación de agregar fue exitosa
   * @returns boolean
   */
  agregarDamnificada(ngForm: NgForm) {
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
        this.damnificada = res as Persona;
        this.agregarVictimario(ngForm);
        //return true;
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

    let copia = this.restriccionService.restricciones;
    copia.sort((a, b) => {
      if (a.restriccion.idRestriccion > b.restriccion.idRestriccion) {
        return 1
      }
      return -1
    })
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
          this.detalle.restriccion = this.restriccion;
          this.detalleService.putDetalle(this.detalle).subscribe(res => {

            this.restriccionService.putRestriccion(this.restriccion)
              .subscribe(res => {
                this.spinner.hide();
                this.toastr.success("La restricción se modificó correctamente", "Modificada!");
                restriccionForm.reset();
                this.getRestricciones();
                this.getDetalles();
                document.getElementById("labelVictimario").innerHTML = "";
                document.getElementById("labelDamnificada").innerHTML = "";
                document.getElementById("labelAdministrativo").innerHTML = "";
                this.victimario = new Persona;
                this.damnificada = new Persona;
                this.administrativo = new Usuario;
                this.detalle = new DetalleRestriccion;
                this.editarBandera = false;
                this.eliminarErroresCampos();

              })
          })
        

      }
    }
    else {
      this.agregarDamnificada(restriccionForm);
    }
  }


  agregarRestriccion(restriccionForm: NgForm) {
    /*if (this.agregarDamnificada() == false || this.agregarVictimario() == false) {
      return
    }*/

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

    let copia = this.restriccionService.restricciones;
    copia.sort((a, b) => {
      if (a.restriccion.idRestriccion > b.restriccion.idRestriccion) {
        return 1
      }
      return -1
    })

    this.restriccion.idDamnificada = this.damnificada.idPersona;
    this.restriccion.idVictimario = this.victimario.idPersona;
    this.restriccion.idGrupo = this.grupoSeleccionado;
    let ngbDate = restriccionForm.value.dp;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    this.restriccion.fechaSentencia = myDate;
    if (this.restriccion.idDamnificada == 0 || this.restriccion.idVictimario == 0) {
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
          } else {

            //detalle
            this.detalle.detalle = this.detalle.detalle;
            this.detalle.juez = this.detalle.juez;
            this.detalle.comisaria = this.comisarias.filter(com => com.idComisaria == this.comisariaSeleccionado)[0];
            this.detalle.juzgado = this.juzgados.filter(com => com.idJuzgado == this.juzgadoSeleccionado)[0];

            let idRes = copia[this.restriccionService.restricciones.length - 1].restriccion.idRestriccion;
            this.restriccionService.getByid(idRes + 1).subscribe(restriccion => {
              let ultima = restriccion as Restriccion;
              this.detalle.restriccion = ultima;
              this.detalleService.postDetalle(this.detalle)
                .subscribe(detalleRes => {
                  this.spinner.hide();
                  var detalleError = detalleRes as ErrorDTO;
                  if (detalleError.hayError) {
                    this.toastr.error("" + detalleError.mensajeError, "Error al guardar detalle!");
                  } else {
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
                });
            })
          }
        });
    }
  }

  confirm() {
    if (window.confirm("Are you sure to delete ")) {
    }
  }

  editarRestriccion(restriccionDTO: RestriccionDTO) {
    this.restriccion = restriccionDTO.restriccion;
    this.victimario = restriccionDTO.victimario;
    this.damnificada = restriccionDTO.damnificada;
    this.administrativo = restriccionDTO.administrativo;
    this.detalle = this.detalles.filter(det => det.restriccion.idRestriccion == restriccionDTO.restriccion.idRestriccion)[0];
    this.detalle.restriccion = restriccionDTO.restriccion;
    this.editarBandera = true;
  }

  eliminarRestriccion(restriccionDTO: RestriccionDTO) {

    let idD = this.detalles.filter(det => det.restriccion.idRestriccion == restriccionDTO.restriccion.idRestriccion)[0];

    if (window.confirm("Are you sure to delete ")) {
      this.spinner.show();
      this.detalleService.deleteDetalle(idD.idDetalle).subscribe(detail => {
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
      });
    }
  }

  masInfo(restriccionDTO: RestriccionDTO) {

    let detalle = this.detalles.filter(det => det.restriccion.idRestriccion == restriccionDTO.restriccion.idRestriccion)[0];

    this.infoResId = restriccionDTO.restriccion.idRestriccion;
    this.infoDamnificadaNombre = restriccionDTO.damnificada.nombre + " " + restriccionDTO.damnificada.apellido;
    this.infoDamnificadaDNI = restriccionDTO.damnificada.dni;
    this.infoVictimarioNombre = restriccionDTO.victimario.nombre + " " + restriccionDTO.victimario.apellido;
    this.infoVictimarioDNI = restriccionDTO.victimario.dni;
    this.infoResFecha = restriccionDTO.restriccion.fechaSentencia;
    this.infoResAdmin = restriccionDTO.administrativo.email;
    this.infoResDistancia = restriccionDTO.restriccion.distancia;
    this.infoResDetalle = detalle.detalle;
    this.infoResJuez = detalle.juez;
    this.infoResComisaria = detalle.comisaria.nombre;
    this.infoResJuzgado = detalle.juzgado.nombre + " " + detalle.juzgado.jurisdiccion;

    this.modalAbierta = true;
  }


  cerrarModal() {

    this.modalAbierta = false;
  }


  //filtros

  traerTodos() {
    this.getRestricciones();

    this.dniFilterDamnificada = null;
    this.dniFilterVictimario = null;
    this.emailFilter = null;
    this.grupoFilter = null;
  }

  filtrarTodo() {
    let resultadosFiltrados = this.originalRes;

    // Filtrar por administrativo si el filtro de email está presente
    if (this.emailFilter) {
      resultadosFiltrados = resultadosFiltrados.filter(restriccion =>
        restriccion.administrativo.email === this.emailFilter);
    }

    // Filtrar por damnificada si el filtro de DNI de damnificada está presente
    if (this.dniFilterDamnificada) {
      resultadosFiltrados = resultadosFiltrados.filter(restriccion =>
        restriccion.damnificada.dni === this.dniFilterDamnificada);
    }

    // Filtrar por victimario si el filtro de DNI de victimario está presente
    if (this.dniFilterVictimario) {
      resultadosFiltrados = resultadosFiltrados.filter(restriccion =>
        restriccion.victimario.dni === this.dniFilterVictimario);
    }

    // Filtrar por grupo si el filtro de grupo está presente
    if (this.grupoFilter) {
      resultadosFiltrados = resultadosFiltrados.filter(restriccion => {
        return restriccion.restriccion.idGrupo.toString() === this.grupoFilter + ""
      });
    }
    // Asignar los resultados finales al arreglo de restricciones
    this.restriccionService.restricciones = resultadosFiltrados;

  }

  //ordenamiento tabla restricciones

  ordenarPorID() {

    let orden: number = this.ordenID ? 1 : -1

    let restriccion: RestriccionDTO[] = this.restriccionService.restricciones;
    restriccion.sort((a, b) => {
      if (a.restriccion.idRestriccion > b.restriccion.idRestriccion) {
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenID = !this.ordenID;


  }

  ordenarPorAdministrativo() {

    let orden: number = this.ordenAdmin ? 1 : -1

    let restriccion: RestriccionDTO[] = this.restriccionService.restricciones;
    restriccion.sort((a, b) => {
      if (a.administrativo.email > b.administrativo.email) {
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenAdmin = !this.ordenAdmin;
  }

  ordenarPorVictimario() {
    let orden: number = this.ordenVictimario ? 1 : -1

    let restriccion: RestriccionDTO[] = this.restriccionService.restricciones;
    restriccion.sort((a, b) => {
      if (a.victimario.dni > b.victimario.dni) {
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenVictimario = !this.ordenVictimario;
  }

  ordenarPorGrupoR() {

    let orden: number = this.ordenGrupo ? 1 : -1

    let restriccion: RestriccionDTO[] = this.restriccionService.restricciones;
    restriccion.sort((a, b) => {
      if (a.restriccion.idGrupo > b.restriccion.idGrupo) {
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenGrupo = !this.ordenGrupo;
  }

  ordenarPorDamnificada() {

    let orden: number = this.ordenDamnificada ? 1 : -1

    let restriccion: RestriccionDTO[] = this.restriccionService.restricciones;
    restriccion.sort((a, b) => {
      if (a.damnificada.dni > b.damnificada.dni) {
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenDamnificada = !this.ordenDamnificada;
  }

  toggleSelect() {
    this.showSelect = !this.showSelect;
  }

  cambiarVista() {
    this.mostrarGrupoRestricciones = !this.mostrarGrupoRestricciones
    this.mostrarAbmRestricciones = !this.mostrarAbmRestricciones
    this.restriccionFisica = false
  }

  mostrarGrupos() {
    this.mostrarGrupoRestricciones = true
    this.mostrarAbmRestricciones = false
    this.restriccionFisica = false
    this.restriccionMultiplePersona = false

  }

  mostrarRestriccionesFisicas() {
    this.mostrarGrupoRestricciones = false
    this.mostrarAbmRestricciones = false
    this.restriccionFisica = true
    this.restriccionMultiplePersona = false

  }

  mostrarRestricciones() {
    this.mostrarGrupoRestricciones = false
    this.mostrarAbmRestricciones = true
    this.restriccionFisica = false
    this.restriccionMultiplePersona = false
  }

  mostrarMultiplesPersonas() {
    this.mostrarGrupoRestricciones = false
    this.mostrarAbmRestricciones = false
    this.restriccionFisica = false
    this.restriccionMultiplePersona = true
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
    return string.length == 0
  }
}





