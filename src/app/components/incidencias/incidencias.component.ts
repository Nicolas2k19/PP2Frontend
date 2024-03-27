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


  constructor(private comunicacionServicio: ComunicacionService,
    private incideciaServicio: IncidenciaService,
    private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.getRestriccion();
    if(this.restriccion != null){
      this.getIncidenciasPorRestriccion(this.restriccion.restriccion.idRestriccion)
    }
  }

  getRestriccion() {
    this.restriccion = this.comunicacionServicio.restriccionDTO;
    if (this.restriccion != null) {
      document.getElementById("restriccionSeleccionada").innerHTML = ""
        + this.restriccion.victimario.apellido + ", " + this.restriccion.victimario.nombre +
        " - "
        + this.restriccion.damnificada.apellido + ", " + this.restriccion.damnificada.nombre;
    }
  }

  getIncidenciasPorRestriccion(idRestriccion: number) {
    this.spinnerService.show();
    this.incideciaServicio.getIncidenciasPorRestriccion(idRestriccion, this.cantidadIncidencias)
      .subscribe(res => {
        this.incidencias = res as Incidencia[];
        for (var i = 0; i < this.incidencias.length; i++) {
          if(this.incidencias[i].topico == "VictimarioIlocalizable"){
            this.incidencias[i].topico = "Victimario ilocalizable";
          }
          if(this.incidencias[i].topico == "DamnificadaIlocalizable"){
            this.incidencias[i].topico = "Damnificada ilocalizable";
          }
          if(this.incidencias[i].topico == "PruebaDeVidaFallida"){
            this.incidencias[i].topico = "Prueba de vida fallida";
          }
          if(this.incidencias[i].topico == "InfraccionDeRestriccion"){
            this.incidencias[i].topico = "Infraccion de restriccion";
          }
          if(this.incidencias[i].topico == "FueraDeRutina"){
            this.incidencias[i].topico = "Fuera de rutina";
          }
        };
        this.spinnerService.hide();
      });
  }

  getIncidenciasPorTopico(topico: string) {
    this.incideciaServicio.getIncidenciasPorTopico(topico, this.cantidadIncidencias)
      .subscribe(res => {
        this.incidencias = res as Incidencia[];
      });
  }

  seleccionarIncidencia(incidencia: Incidencia){ 
    console.log('me rompi aca ');
    document.getElementById("topico").innerHTML = " " + incidencia.topico;
    document.getElementById("exampleTextarea").innerHTML = " " + incidencia.descripcion;
   
  }

  cargarMas(){
    this.cantidadIncidencias += 20;
    
    this.getIncidenciasPorRestriccion(this.restriccion.restriccion.idRestriccion);
    
    
  }

  cambioTexto(){
    console.log("creado por maty para resolver un error")
  }

}
