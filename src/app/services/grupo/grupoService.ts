import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Grupo from 'src/app/models/grupo/Grupo';
import GrupoNuevo from 'src/app/models/grupo/grupoNuevo';



@Injectable({
    providedIn: 'root'
  })
export default class GrupoService{

    readonly post = environment.apiUrl+'/grupo'+"/nuevoGrupo"
    readonly get = environment.apiUrl+'/grupo'+"/obtenerGrupos"
    readonly getById = environment.apiUrl+'/grupo'+"/obtenerGrupo/"
    readonly getAllById = environment.apiUrl+'/grupo'+"/obtenerGruposPorId/"


    readonly getByNombre = environment.apiUrl+'/grupo'+"/obtenerGrupoPorNombre/"

    readonly postEquipo = environment.apiUrl+'/grupo'+"/nuevoGrupo"
    constructor(private http :HttpClient){

    }
    getGrupos(){
        return this.http.get(this.get)
    }


    getGrupo(idGrupo : Number){
        return this.http.get(this.getById+idGrupo);
    }

    getGruposByID(idGrupo : Number){
        return this.http.get(this.getAllById+idGrupo);
    }

    getGrupoByNombre(nombreGrupo : String){
        return this.http.get(this.getByNombre+nombreGrupo);
    }


    crearEquipo(grupo  : GrupoNuevo){
        return this.http.post(this.postEquipo,grupo)
    }
}