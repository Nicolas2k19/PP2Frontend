import { Component, OnInit } from '@angular/core';
import { PruebaDeVida } from 'src/app/models/prueba-de-vida';
import { NgForm } from '@angular/forms';
import { PruebaDeVidaService } from 'src/app/services/pruebaDeVida/prueba-de-vida.service';
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import { NgxSpinnerService } from 'ngx-spinner';
import { FotoIdentificacion } from 'src/app/models/foto-identificacion';
import { FotoIdentificacionService } from 'src/app/services/fotoIdentificacion/foto-identificacion.service';
import { FotoPruebaDeVida } from 'src/app/models/foto-prueba-de-vida';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/services/personas/persona.service';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/login/usuario.service';
import { PruebaDeVidaMultiple } from 'src/app/models/prueba-de-vida-multiple';
import { PruebaDeVidaMultipleService } from 'src/app/services/pruebaDeVidaMultiple/prueba-de-vida-multiple.service';
import { ParametroService } from 'src/app/services/parametros/parametro.service';
import { Parametro } from 'src/app/models/parametro';

@Component({
  selector: 'app-pruebas-de-vida',
  templateUrl: './pruebas-de-vida.component.html',
  styleUrls: ['./pruebas-de-vida.component.css']
})
export class PruebasDeVidaComponent implements OnInit {

  pruebaDeVida = new PruebaDeVida;
  spinnerBoolean: boolean = false;
  restriccion: RestriccionDTO;
  imgPerfil: String;
  imgPruebaDeVida: String;
  respondio: boolean = true;
  opcionesDesplegable: Persona[];
  seleccionado: Persona = null;
  selectedUserLabel: string = "Pruebas de vida para: ";
  usuarioSeleccionado: Usuario;
  pruebasDeVida: PruebaDeVida[] = [];
  pruebasFiltradas: PruebaDeVida[] = [];
  fechaFiltro: string = '';
  estadoFiltro: string = '';
  showSelect: boolean = false;
  showFiltros: boolean = false;
  orderedColumn: string = '';
  ascendingOrder: boolean = true;
  opciones = [
    { valor: "ambosOjosCerrados", texto: "Ambos Ojos Cerrados" },
    { valor: "ambosOjosAbiertos", texto: "Ambos Ojos Abiertos" },
    { valor: "ojoIzquierdoCerrado", texto: "Ojo Izquierdo Cerrado" },
    { valor: "ojoDerechoCerrado", texto: "Ojo Derecho Cerrado" },
    { valor: "bocaAbierta", texto: "Boca Abierta" },
    { valor: "bocaCerrada", texto: "Boca Cerrada" },
    { valor: "sonrisa", texto: "Sonrisa" }
  ];
  accionSimple = '';
  tipoPruebaDeVida: string = 'simple'; // Tipo de prueba de vida seleccionada
  accionesMultiples: { valor: string }[] = [{ valor: '' }]; // Acciones para prueba de vida múltiple
  pruebasSimples: PruebaDeVida[] = [];
  pruebasMultiples: PruebaDeVidaMultiple[] = [];
  pruebasGrupo: PruebaDeVida[] = [];
  estadoGrupo: string = 'Pendiente'
  descripcionPruebaMultiple: string = '';
  tiempoDeRespuesta: Date = new Date();
  diferenciaHoraria: number = 3; //Diferencia de argentina

  constructor(
    private pruebaDeVidaService: PruebaDeVidaService,
    private comunicacion: ComunicacionService,
    config: NgbModalConfig, private modalService: NgbModal,
    private spinnerService: NgxSpinnerService,
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private pruebaDeVidaMultipleService: PruebaDeVidaMultipleService,
    private fotoIdentificacionService: FotoIdentificacionService,
    private parametroService: ParametroService) {

    config.backdrop = 'static';
    config.keyboard = false;
  }

  async ngOnInit() {
    if (this.comunicacion.restriccionDTO != null) {
      this.restriccion = this.comunicacion.restriccionDTO;
      if (this.seleccionado != null) {
        this.getPruebasDeVidaPersona(this.seleccionado.idPersona);
      } else {
        this.selectedUserLabel += this.comunicacion.restriccionDTO.victimario.apellido;
        await this.personaService.getPersona(this.comunicacion.restriccionDTO.victimario.idPersona).subscribe(res=>{
          this.seleccionado = (res as Persona);//Por defecto toma al agresor
          this.getPruebasDeVidaPersona(this.seleccionado.idPersona);
          this.opcionesDesplegable = [this.restriccion.victimario, this.restriccion.damnificada];
          this.cargarPruebasSimples();
          this.obtenerFotoDePerfil();
          this.cargarPruebasMultiples();
        })
      }
      this.spinnerService.show();
    }
    this.opcionesDesplegable = [this.restriccion.victimario, this.restriccion.damnificada];
  }

  seleccionarOpcion(opcion: Persona) {
    this.personaService.getPersona(opcion.idPersona)
      .subscribe(
        (res: Persona) => {
          this.seleccionado = res;
          this.selectedUserLabel = "Pruebas de vida para: " + this.seleccionado.apellido;
          this.obtenerFotoDePerfil();
          this.cargarPruebasSimples();
          this.cargarPruebasMultiples();
        },
        (error) => {
          console.error('Error al obtener persona:', error);
        }
      );
  }

  obtenerFotoDePerfil() {
    this.fotoIdentificacionService.getFotoPefil(this.seleccionado.idPersona)
      .subscribe(res => {
        this.spinnerService.hide();
        var foto = res as FotoIdentificacion;
        this.imgPerfil = foto.foto;
      });
  }

  cambiarTipoPruebaDeVida(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.tipoPruebaDeVida = selectElement.value;
    if (this.tipoPruebaDeVida === 'simple') {
      this.accionesMultiples = [{ valor: '' }]; // Reiniciar acciones múltiples si se cambia a simple
    }
  }

  agregarAccion() {
    this.accionesMultiples.push({ valor: '' });
  }

  eliminarAccion(index: number) {
    if (this.accionesMultiples.length > 1) {
      this.accionesMultiples.splice(index, 1);
    }
  }

  seleccionarAccion(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedIndex = selectElement.selectedIndex;
    const selectedOption = selectElement.options[selectedIndex];
    this.pruebaDeVida.accion = selectElement.value;
    this.pruebaDeVida.descripcion = selectedOption.textContent.trim();
  }

  generarAleatorio(form: NgForm) {
    const tipoAleatorio = Math.random() < 0.5 ? 'simple' : 'multiple';
    form.controls['tipoPruebaDeVida'].setValue(tipoAleatorio);

    if (tipoAleatorio === 'simple') {
      const opcionAleatoria = this.opciones[Math.floor(Math.random() * this.opciones.length)];
      this.accionSimple = opcionAleatoria.valor;
      this.pruebaDeVida.descripcion = opcionAleatoria.texto
    } else {
      this.descripcionPruebaMultiple = 'Prueba multiple,';
      this.accionesMultiples = [{ valor: '' }];
      const numAcciones = Math.floor(Math.random() * 5) + 1; // Genera entre 1 y 5 acciones
      for (let i = 0; i < numAcciones; i++) {
        const opcionAleatoria = this.opciones[Math.floor(Math.random() * this.opciones.length)];
        this.accionesMultiples[i] = { valor: opcionAleatoria.valor };
      }
    }
  }

  async enviarPruebaDeVida(pruebaDeVidaForm: NgForm) {
    if (this.tipoPruebaDeVida === 'simple') {
      this.enviarPruebaDeVidaSimple(pruebaDeVidaForm);

    } else if (this.tipoPruebaDeVida === 'multiple') {
      this.enviarPruebaDeVidaMultiple(pruebaDeVidaForm);
    }
  }

  enviarPruebaDeVidaSimple(pruebaDeVidaForm: NgForm) {
    this.pruebaDeVida.idRestriccion = this.comunicacion.restriccionDTO.restriccion.idRestriccion;
    this.usuarioService.getUsuario(this.seleccionado.idUsuario).subscribe( async (res: Usuario) => {
        this.usuarioSeleccionado = res;
        if (this.usuarioSeleccionado) {
          this.pruebaDeVida.idPersonaRestriccion = this.seleccionado.idPersona;
          this.pruebaDeVida.estado = "Pendiente";
          this.pruebaDeVida.esMultiple = false;
          this.pruebaDeVida.accion = this.accionSimple;
          await this.parametroService.getById(1).subscribe(async res => {
            let parametro = res as Parametro;
            this.parseHoraStringToFecha(parametro.valor);
            this.pruebaDeVida.tiempoDeRespuesta = this.tiempoDeRespuesta
            const fechaActual = new Date(this.pruebaDeVida.tiempoDeRespuesta.getTime());
            fechaActual.setHours(fechaActual.getHours() + this.diferenciaHoraria);
            this.pruebaDeVida.descripcion += " (disponible hasta las: " + fechaActual.getHours() + ":" + (fechaActual.getMinutes() < 10 ? '0' : '') + fechaActual.getMinutes() + ")";

            this.spinnerService.show();
            this.pruebaDeVidaService.postPruebaDeVida(this.pruebaDeVida).subscribe((res) => {
                this.getPruebasDeVidaPersona(this.pruebaDeVida.idPersonaRestriccion);
                this.spinnerService.hide();
                pruebaDeVidaForm.reset();
                this.pruebaDeVida = new PruebaDeVida();
              },(error) => {
                console.error('Error al enviar prueba de vida:', error);
                this.spinnerService.hide();
              }
            );
          });
        } else {
          console.error('Usuario seleccionado no está definido.');
        }
      },(error) => {
        console.error('Error al obtener usuario:', error);
      });
  }

  async enviarPruebaDeVidaMultiple(pruebaDeVidaForm: NgForm) {
    let pruebaDeVidaMultiple = new PruebaDeVidaMultiple();
    pruebaDeVidaMultiple.idPersona = this.seleccionado.idPersona;
    pruebaDeVidaMultiple.estado = 'Pendiente';
    await this.parametroService.getById(1).subscribe(async res => {
      let parametro = res as Parametro;
      this.parseHoraStringToFecha(parametro.valor);
      this.pruebaDeVida.tiempoDeRespuesta = this.tiempoDeRespuesta
      pruebaDeVidaMultiple.tiempoDeRespuesta = this.tiempoDeRespuesta
      const fechaActual = new Date(this.tiempoDeRespuesta.getTime());
      fechaActual.setHours(fechaActual.getHours() + this.diferenciaHoraria);
      fechaActual.setMonth(fechaActual.getMonth()+1)
      pruebaDeVidaMultiple.descripcion = this.descripcionPruebaMultiple + " disponible hasta las: " + fechaActual.getHours() + ":" + (fechaActual.getMinutes() < 10 ? '0' : '') + fechaActual.getMinutes() + " del " + fechaActual.getDate() + "/" + (fechaActual.getMonth() < 10 ? '0' : '') + fechaActual.getMonth() ;
      this.pruebaDeVidaMultipleService.postPruebaDeVidaMultiple(pruebaDeVidaMultiple).subscribe(res => {
        let nuevaPruebaDeVidaMultiple = res as PruebaDeVidaMultiple;
        this.accionesMultiples.forEach(async (accion) => {
          this.pruebaDeVida.accion = accion.valor;
          this.pruebaDeVida.idPersonaRestriccion = this.seleccionado.idPersona;
          this.pruebaDeVida.estado = "Pendiente";
          this.pruebaDeVida.esMultiple = true;
          this.pruebaDeVida.descripcion = this.tranformaAccion(accion.valor)
          this.pruebaDeVida.idPruebaDeVidaMultiple = nuevaPruebaDeVidaMultiple.idPruebaDeVidaMultiple;
          this.pruebaDeVida.idRestriccion = this.comunicacion.restriccionDTO.restriccion.idRestriccion;
          await this.pruebaDeVidaService.postPruebaDeVida(this.pruebaDeVida).subscribe(res => {
            this.getPruebasDeVidaPersona(this.seleccionado.idPersona);
            this.pruebaDeVida = new PruebaDeVida();
          })
          this.spinnerService.hide();
          pruebaDeVidaForm.reset();
          this.cargarPruebasMultiples();
        });
      });
    })
  }

  parseHoraStringToFecha(hora: string) {
    const [horas, minutos] = hora.split(':').map(num => parseInt(num, 10));
    const fechaActual = new Date();

    this.tiempoDeRespuesta = new Date(fechaActual);
    this.tiempoDeRespuesta.setHours(fechaActual.getHours() + horas - this.diferenciaHoraria); //Resto 3 para acomodar las horas
    this.tiempoDeRespuesta.setMinutes(fechaActual.getMinutes() + minutos);
  }

  getPruebasDeVidaPersona(idPersona: number) {
    this.spinnerService.show();
    this.pruebaDeVidaService.getPruebasDeVidaPersona(idPersona)
      .subscribe(res => {
        this.spinnerService.hide();
        this.pruebasDeVida = res as PruebaDeVida[];
        this.cargarPruebasSimples();
        this.aplicarFiltros();
      })
  }

  aplicarFiltros() {
    this.pruebasFiltradas = this.pruebasDeVida.filter(prueba => {
      const fechaPrueba = new Date(prueba.fecha); // Convertir fecha de prueba a objeto Date
      const cumpleFecha = !this.fechaFiltro || this.formatoFecha(fechaPrueba) === this.fechaFiltro;
      const cumpleEstado = !this.estadoFiltro || prueba.estado === this.estadoFiltro;
      const cumpleSimple = prueba.esMultiple == false;
      return cumpleFecha && cumpleEstado && cumpleSimple;
    });
  }

  formatoFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = fecha.getMonth() + 1; // Sumar 1 porque los meses van de 0 a 11
    const day = fecha.getDate();

    const monthStr = (month < 10) ? `0${month}` : `${month}`;
    const dayStr = (day < 10) ? `0${day}` : `${day}`;

    return `${year}-${monthStr}-${dayStr}`;
  }


  aceptarPruebaDeVida() {
    this.spinnerService.show();
    this.pruebaDeVida.estado = "Aceptada";
    this.pruebaDeVidaService.putPruebaDeVida(this.pruebaDeVida)
      .subscribe(res => {
        this.pruebaDeVida = new PruebaDeVida;
        this.getPruebasDeVidaPersona(this.seleccionado.idPersona);
        this.modalService.dismissAll();
        this.spinnerService.hide();
      })
  }

  rechazarPruebaDeVida() {
    this.spinnerService.show();
    this.pruebaDeVida.estado = "Rechazada";
    this.pruebaDeVidaService.putPruebaDeVida(this.pruebaDeVida)
      .subscribe(res => {
        this.pruebaDeVida = new PruebaDeVida;
        this.getPruebasDeVidaPersona(this.seleccionado.idPersona);
        this.modalService.dismissAll();
        this.spinnerService.hide();
      })

  }

  open(content, prueba: PruebaDeVida) {
    this.pruebaDeVida = prueba;
    this.imgPruebaDeVida = "";
    this.respondio = true;
    this.getRespuestaPruebaDeVida(prueba);
    this.modalService.open(content, { size: 'xl' });
  }

  getRespuestaPruebaDeVida(prueba: PruebaDeVida) {
    this.spinnerService.show();
    this.pruebaDeVidaService.getFotoPruebaDeVida(prueba.idPruebaDeVida).
      subscribe(res => {
        this.spinnerService.hide();
        var foto = res as FotoPruebaDeVida;
        if (foto == null) {
          this.respondio = false;
        }
        else {
          this.imgPruebaDeVida = foto.foto;
        }
      });
  }

  cargarPruebasSimples() {
    this.pruebasSimples = this.pruebasDeVida.filter(prueba => !prueba.esMultiple);
    this.pruebasFiltradas = this.pruebasSimples;
  }

  cargarPruebasMultiples() {
    this.pruebaDeVidaMultipleService.getPruebasDeVidaMultiples(this.seleccionado.idPersona).subscribe(res => {
      this.pruebasMultiples = (res as PruebaDeVidaMultiple[]).reverse();
    });
  }

  obtenerPruebasGrupo(prueba: any) {
    this.pruebaDeVidaService.getPruebaDeVidaByidPruebaDeVidaMultiple(prueba.idPruebaDeVidaMultiple).subscribe(res => {
      this.pruebasGrupo = (res as PruebaDeVida[]);
      this.verificarEstadoDePruebaDeVidaMultiples(this.pruebasGrupo)
    })
  }

  verificarEstadoDePruebaDeVidaMultiples(pruebasDeVida: PruebaDeVida[]) {
    let countAceptadas = 0;
    let countRechazadas = 0;
    let countSinRespuesta = 0;
    this.estadoGrupo = 'Pendiente'
    let idPruebaMultiple = 0
    pruebasDeVida.forEach(prueba => {
      idPruebaMultiple = prueba.idPruebaDeVidaMultiple;
      if (prueba.estado == 'Aceptada' || prueba.estado == 'AceptadaAutomaticamente')
        countAceptadas++
      if (prueba.estado == 'Rechazada' || prueba.estado == 'RechazadaAutomaticamente')
        countRechazadas++
      if (prueba.estado == 'SinRespuesta')
        countSinRespuesta++
    })
    if (countAceptadas == pruebasDeVida.length)
      this.estadoGrupo = 'Aceptada'
    if (countRechazadas > 0)
      this.estadoGrupo = 'Rechazada'
    if (countSinRespuesta > 0)
      this.estadoGrupo = 'SinRespuesta'

    this.pruebaDeVidaMultipleService.actualizarEstadoPruebaDeVida(idPruebaMultiple, this.estadoGrupo).subscribe(res => { })
  }

  transformarEstado(estado: string): string {
    switch (estado) {
      case 'AceptadaAutomaticamente':
        return 'Aceptada Automaticamente';
      case 'RechazadaAutomaticamente':
        return 'Rechazada Automaticamente';
      case 'SinRespuesta':
        return 'Sin Respuesta';
      default:
        return estado;
    }
  }

  tranformaAccion(accion: string): string {
    let accionTransformada = ''
    this.opciones.forEach(opcion => {
      if (accion == opcion.valor) {
        accionTransformada = opcion.texto;
      }
    })
    return accionTransformada
  }

  cerrarModal() {
    this.pruebaDeVida = new PruebaDeVida;
    this.modalService.dismissAll();
  }

  toggleSelect() {
    this.showSelect = !this.showSelect;
  }

  toggleFiltros() {
    this.showFiltros = !this.showFiltros;
  }

  sortColumn(columnName: string): void {
    if (this.orderedColumn === columnName) {
      // Cambia el estado de orden entre ascendente y descendente
      this.ascendingOrder = !this.ascendingOrder;
    } else {
      // Establece el orden ascendente como predeterminado
      this.ascendingOrder = true;
      this.orderedColumn = columnName;
    }

    // Ordena el arreglo pruebasFiltradas según la columna y el estado de orden
    this.pruebasFiltradas.sort((a, b) => {
      const valueA = a[columnName];
      const valueB = b[columnName];

      if (valueA < valueB) {
        return this.ascendingOrder ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.ascendingOrder ? 1 : -1;
      }
      return 0;
    });
  }
}
