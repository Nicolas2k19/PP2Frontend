import { environment } from "src/environments/environment";

import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
  })
export default class NormalizadorService{


    readonly api_normalizador_direcciones= environment.apiNormalizacion + "direcciones?"
    

    constructor(private http:HttpClient){

    }
    obtenerCoordenadasConCalleAltura(calle : string,altura : string,localidad:string,provincia : string){
       return this.http.get(`${this.api_normalizador_direcciones}direccion=${calle} ${altura}&departamento=${localidad}&provincia=${provincia}`);
    }




}