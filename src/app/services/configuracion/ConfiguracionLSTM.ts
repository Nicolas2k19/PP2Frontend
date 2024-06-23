import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import UbicacionEntrenamiento from '../ubicaciones/ubicionEntrenamieto';
import ConfiguracionEntrenamiento from 'src/app/models/Configuracion/ConfiguracionEntrenamiento';
import Configuracion from 'src/app/models/Configuracion/Configuracion';




@Injectable({
    providedIn: 'root'
})
export default class ConfiguracionLSTM {

    readonly url = environment.apiUrl+"/IdentificacionRutinas"

    constructor(private http: HttpClient){

    }
    cargarDatos(config:Configuracion){
        console.log("Llegue ultimo")
        return this.http.post(this.url+"/crearIdentificador",config)
     }

     entrenar(config:Configuracion){
        console.log("Llegue ultimo")
        return this.http.post(this.url+"/entrenar",config)
     }
 


}