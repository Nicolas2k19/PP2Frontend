import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';



@Injectable({
    providedIn: 'root'
  })
export default class GrupoService{

    readonly post = environment.apiUrl+'/grupo'+"/nuevoGrupo"
    readonly get = environment.apiUrl+'/grupo'+"/obtenerGrupos"
    readonly getById = environment.apiUrl+'/grupo'+"/obtenerGrupo/"
    constructor(private http :HttpClient){

    }
    getGrupos(){
        return this.http.get(this.get)
    }


    getGrupo(idGrupo : Number){
        return this.http.get(this.getById+idGrupo);
    }
}