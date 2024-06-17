import { Component, OnInit } from '@angular/core';
import { ParametroService } from 'src/app/services/parametros/parametro.service';
import { Parametro } from 'src/app/models/parametro';

@Component({
  selector: 'app-parametros-prueba-de-vida',
  templateUrl: './parametros-prueba-de-vida.component.html',
  styleUrls: ['./parametros-prueba-de-vida.component.css']
})
export class ParametrosPruebaDeVidaComponent implements OnInit {
  hours: number = 0;
  minutes: number = 0;
  duration: string = '';

  tiempoDeEspera: Parametro = new Parametro();

  constructor(
    private parametroService : ParametroService
  ){

  }

  ngOnInit() {
    this.getTiempoDeRespuesta();
  }

  getTiempoDeRespuesta(){
    this.parametroService.getById(1).subscribe(res=>{
      let parametro = res as Parametro
      this.duration = parametro.valor 
    })
  }

  onSubmit() {
    this.updateDuration();
  }
  
  updateDuration() {
    this.normalizarRangos();
    this.duration = `${(this.hours < 10 ? '0' : '') + this.hours}:${this.minutes.toString().padStart(2, '0')}:00`;
    this.tiempoDeEspera.valor = this.duration;
    this.parametroService.update(1,this.tiempoDeEspera).subscribe(res=>{
      console.log("Actulice correctamente el parametro: "+ (res as Parametro));
    })
  }

  normalizarRangos(){
    if (this.hours > 24) {
      this.hours = 24;
    }
    if (this.minutes > 59) {
      this.minutes = 59;
    }
    if (this.hours < 0) {
      this.hours = 0;
    }
    if (this.minutes < 0) {
      this.minutes = 0;
    }
  }
}



  

