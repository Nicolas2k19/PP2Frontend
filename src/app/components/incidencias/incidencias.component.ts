import { Component, OnInit } from '@angular/core';
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import { IncidenciaService } from 'src/app/services/incidencias/incidencia.service';
import { Incidencia } from 'src/app/models/incidencia';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.component.html',
  styleUrls: ['./incidencias.component.css']
})
export class IncidenciasComponent implements OnInit {

  restriccion: RestriccionDTO;
  incidencias: Incidencia[];

  cantidadIncidencias: number = 20;



  //peligrosidad
  editandoPeligrosidad: boolean = false;
  guardarPeligrosidad: boolean = false;
  peligrosidadElegida: string;


  //filtros
  showSelect :boolean = false;
  filtroSeleccionado: string;


  //ordenamiento

  ordenTipo :boolean;
  ordenFecha:boolean;
  ordenPeligrosidad :boolean;


  constructor(private comunicacionServicio: ComunicacionService,
    private incideciaServicio: IncidenciaService,
    private spinnerService: NgxSpinnerService) { 


      this.ordenTipo=true;
    this.ordenFecha=true;
    this.ordenPeligrosidad=true;
    }

  ngOnInit() {
    this.getRestriccion();
    if (this.restriccion != null) {
      this.getIncidenciasPorRestriccion(this.restriccion.restriccion.idRestriccion)
    }
  }

  getRestriccion() {
    this.restriccion = this.comunicacionServicio.restriccionDTO;
    if (this.restriccion != null) {
      document.getElementById("restriccionSeleccionada").innerHTML ="Incidencias de la restricción #"
        + this.restriccion.restriccion.idRestriccion;
    }
  }

  getIncidenciasPorRestriccion(idRestriccion: number) {
    this.spinnerService.show();
    this.incideciaServicio.getIncidenciasPorRestriccion(idRestriccion, this.cantidadIncidencias)
      .subscribe(res => {
        this.incidencias = res as Incidencia[];
        this.parseIncidencias();
        this.spinnerService.hide();
      });
  }

  private parseIncidencias() {
    for (var i = 0; i < this.incidencias.length; i++) {
      if (this.incidencias[i].topico == "VictimarioIlocalizable") {
        this.incidencias[i].topico = "Victimario ilocalizable";
      }
      if (this.incidencias[i].topico == "DamnificadaIlocalizable") {
        this.incidencias[i].topico = "Damnificada ilocalizable";
      }
      if (this.incidencias[i].topico == "PruebaDeVidaFallida") {
        this.incidencias[i].topico = "Prueba de vida fallida";
      }
      if (this.incidencias[i].topico == "InfraccionDeRestriccion") {
        this.incidencias[i].topico = "Infraccion de restriccion";
      }
      if (this.incidencias[i].topico == "FueraDeRutina") {
        this.incidencias[i].topico = "Fuera de rutina";
      }
    };
  }

  getIncidenciasPorTopico(topico: string) {
    this.incideciaServicio.getIncidenciasPorTopico(topico, this.cantidadIncidencias)
      .subscribe(res => {
        this.incidencias = res as Incidencia[];
      });
  }

  seleccionarIncidencia(incidencia: Incidencia) {
    document.getElementById("topico").innerHTML = " " + incidencia.topico;
    document.getElementById("descripción").innerHTML = " " + incidencia.descripcion;
    document.getElementById("peligrosidad").innerHTML = " " + incidencia.peligrosidad;

  }

  cargarMas() {
    this.cantidadIncidencias += 20;

    this.getIncidenciasPorRestriccion(this.restriccion.restriccion.idRestriccion);


  }


  guardandoPeligrosidad(incidencia: Incidencia) {

    incidencia.peligrosidad = this.peligrosidadElegida;

    this.topicoParserBD(incidencia);

    this.incideciaServicio.updateIncidencia(incidencia).subscribe();


    this.topicoParserInverso(incidencia);

  }


  private topicoParserBD(incidencia: Incidencia) {
    if (incidencia.topico == "Victimario ilocalizable") {
      incidencia.topico = "VictimarioIlocalizable";
    }
    if (incidencia.topico == "Damnificada ilocalizable") {
      incidencia.topico = "DamnificadaIlocalizable";
    }
    if (incidencia.topico == "Prueba de vida fallida") {
      incidencia.topico = "PruebaDeVidaFallida";
    }
    if (incidencia.topico == "Infraccion de restriccion") {
      incidencia.topico = "InfraccionDeRestriccion";
    }
    if (incidencia.topico == "Fuera de rutina") {
      incidencia.topico = "FueraDeRutina";
    }
  }

  private topicoParserInverso(incidencia: Incidencia) {
    if (incidencia.topico == "VictimarioIlocalizable") {
      incidencia.topico = "Victimario ilocalizable";
    }
    if (incidencia.topico == "DamnificadaIlocalizable") {
      incidencia.topico = "Damnificada ilocalizable";
    }
    if (incidencia.topico == "PruebaDeVidaFallida") {
      incidencia.topico = "Prueba de vida fallida";
    }
    if (incidencia.topico == "InfraccionDeRestriccion") {
      incidencia.topico = "Infraccion de restriccion";
    }
    if (incidencia.topico == "FueraDeRutina") {
      incidencia.topico = "Fuera de rutina";
    }
  }


  /** Filtro de incidencias, filtra las incidencias según el select seleccionado.*/

  filtroIncidencia() {
    if (this.filtroSeleccionado == "1") {
      this.getIncidenciasPorRestriccion(this.restriccion.restriccion.idRestriccion);
    } else{ this.incideciaServicio.getIncidenciasPorTopico(this.filtroSeleccionado, this.restriccion.restriccion.idRestriccion).subscribe(res => {
      this.incidencias = res as Incidencia[];
      this.parseIncidencias();
    });}
  }

toggleSelect(){

  this.showSelect = !this.showSelect;
}



  /**
   * Ordena la tabla por provincia
   * @author Vane
   */

ordenarPorPeligrosidad(){

  let orden : number = this.ordenPeligrosidad ?  1:-1

  this.incidencias.sort((a,b)=>{
   if(a.peligrosidad > b.peligrosidad){
     return 1 * orden
   }
   return -1 * orden
  })
  this.ordenPeligrosidad = !this.ordenPeligrosidad;

}

ordenarPorFechayHora(){
  let orden : number = this.ordenFecha ?  1:-1

 this.incidencias.sort((a,b)=>{
  if(a.fecha > b.fecha){
    return 1 * orden
  }
  return -1 * orden
 })
 this.ordenFecha = !this.ordenFecha;

}

ordenarPorTipo(){

  let orden : number = this.ordenTipo ?  1:-1

  this.incidencias.sort((a,b)=>{
   if(a.topico > b.topico){
     return 1 * orden
   }
   return -1 * orden
  })
  this.ordenTipo = !this.ordenTipo;

}


}