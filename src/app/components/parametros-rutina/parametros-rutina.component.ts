import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as e from 'express';
import Configuracion from 'src/app/models/Configuracion/Configuracion';
import ConfiguracionEntrenamiento from 'src/app/models/Configuracion/ConfiguracionEntrenamiento';
import { Persona } from 'src/app/models/persona';
import { Restriccion } from 'src/app/models/restriccion';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import ConfiguracionLSTM from 'src/app/services/configuracion/ConfiguracionLSTM';
import { RestriccionService } from 'src/app/services/restricciones/restriccion.service';
import UbicacionEntrenamiento from 'src/app/services/ubicaciones/ubicionEntrenamieto';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-parametros-rutina',
  templateUrl: './parametros-rutina.component.html',
  styleUrls: ["../styles/stylesGlobales.css",'./parametros-rutina.component.css']
})
export class ParametrosRutinaComponent implements OnInit {

  datosCsv : string [][]
  distancia : number
  epochs : number
  inputlength : number
  units: number;
  batch: number;


  idvictimario : Number

  restricciones : RestriccionDTO[]

  entrenando : boolean;
  entrenado : boolean

  sinDatos : boolean

  configFinalGuardada : Configuracion //iniciarVigilancia

  vigilando : Boolean
  configuraciones : ConfiguracionEntrenamiento[]

  constructor( public serviceConfig :ConfiguracionLSTM, public perimetralService : RestriccionService){
    this.datosCsv = [[]]
  }

  ngOnInit(): void {

    this.obtenerConfiguraciones()

    this.serviceConfig.procesoActivo().subscribe(activo =>{
      this.vigilando = activo as Boolean
     })

    this.sinDatos = true
    this.entrenando = false
    this.entrenado = false
    this.perimetralService.getRestricciones().subscribe((res : RestriccionDTO[])=> this.restricciones = res)
    const inputElement1 : HTMLInputElement= document.querySelector('#distancia-permitida');
    const inputValue1 = inputElement1.value;
    this.distancia = Number.parseInt(inputValue1)
    //cantidad-epochs
    const inputElement2 : HTMLInputElement= document.querySelector('#cantidad-epochs');
    const inputValue2 = inputElement2.value;
    this.epochs = Number.parseInt(inputValue2)

    const inputElement3 : HTMLInputElement= document.querySelector('#cantidad-inputs');
    const inputValue3 = inputElement3.value;
    this.inputlength = Number.parseInt(inputValue3)

    //cantidad-nunits
    const inputElement4 : HTMLInputElement= document.querySelector('#cantidad-nunits');
    const inputValue4 = inputElement4.value;
    this.units = Number.parseInt(inputValue4)

    //batch
     //cantidad-nunits
     const inputElement5 : HTMLInputElement= document.querySelector('#cantidad-batch');
     const inputValue5 = inputElement5.value;
     this.batch = Number.parseInt(inputValue5)

    
  }


  enviarInformacionEntrenamiento(){
      if(this.sinDatos || this.idvictimario==undefined ||this.idvictimario==null || this.entrenado) return

      let persona = this.restricciones.filter(res => { console.log(res.victimario.idPersona == this.idvictimario,res.victimario.idPersona,this.idvictimario); return res.victimario.idPersona == this.idvictimario})[0].victimario 
      let ubicaciones : UbicacionEntrenamiento[] = []
      this.datosCsv.forEach(ubi => {
        console.log(ubi)
        let ubicacion : UbicacionEntrenamiento = new UbicacionEntrenamiento()
        ubicacion.dia = ubi[3]
        ubicacion.fecha = new Date(ubi[2])
        ubicacion.latitud = Number.parseFloat(ubi[1])
        ubicacion.longitud = Number.parseFloat(ubi[0])
        ubicacion.idPersona = persona
        console.log("llegue")
        ubicaciones.push(ubicacion)
      })
      let configuracion : ConfiguracionEntrenamiento = new ConfiguracionEntrenamiento()
      configuracion.input_length = this.inputlength
      configuracion.output = 1
      configuracion.distanciaPermitida = this.distancia
      configuracion.epochs = this.epochs
      configuracion.nunits = this.units
      configuracion.batch_size = this.batch
      configuracion.idPersona  = persona
      let configFinal : Configuracion = new Configuracion()
      configFinal.config = configuracion
      configFinal.ubicaciones = ubicaciones
      this.configFinalGuardada = configFinal;
      this.entrenando = true
      this.entrenado = false
      this.serviceConfig.cargarDatos(configFinal).subscribe(elem =>{
        setTimeout(() => {
              this.serviceConfig.entrenar(configFinal).subscribe(elem =>{
              this.entrenando = false
              this.entrenado = true
              this.obtenerConfiguraciones()
                     })
            }, 20000);

           
  
      })

  }


  vigilar(){
   this.serviceConfig.iniciarVigilancia(this.configFinalGuardada.config.idPersona).subscribe(e =>{
        this.serviceConfig.procesoActivo().subscribe(activo =>{
          this.vigilando = activo as Boolean
         })
   })
  }

   readFile(e){
    let reader = new FileReader();
    let file = (e.target.files[0])
    let thisContext = this
    reader.onload = function(e)  {
      let lines = thisContext.parseCSV(e.target.result);
      thisContext.datosCsv = (lines.slice(1))
    };

    reader.readAsBinaryString(file);
    this.sinDatos = false
  }

  parseCSV(text) {
    // Obtenemos las lineas del texto
    let lines = text.replace(/\r/g, '').split('\n');
    return lines.map(line => {
      // Por cada linea obtenemos los valores
      let values = line.split(',');
      return values;
    });
  }


    obtenerConfiguraciones(){
      this.serviceConfig.obtenerConfiguraciones().subscribe(configs =>{
        this.configuraciones = configs as ConfiguracionEntrenamiento[];
      })
    }


    redireccionar(config : ConfiguracionEntrenamiento){
        location.href=environment.apiUrl+"/IdentificacionRutinas/obtenerCurva/curva"+config.input_length+""+1+""+config.distanciaPermitida+""+config.epochs+".jpg";
    }

  }



  

