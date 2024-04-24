import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Restriccion } from '../../models/restriccion';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RestriccionService {

  /**
   * Restriccion perimetral
   */
  restriccionSeleccionada: Restriccion;
  restricciones: RestriccionDTO[];  
  readonly URL_API = environment.apiUrl+'/RestriccionPerimetral';
  readonly URL_API_RESTRICCION_DTO = environment.apiUrl+'/RestriccionDTO';
  readonly URL_API_GETByid= environment.apiUrl+"RestriccionPerimetral/getByRestriccion/";
  readonly URL_API_GETByidGrupo= environment.apiUrl+"RestriccionPerimetral/ObtenerPorIdGrupo/";

  /**
   * 
   * Restricción física
   */
  readonly URL_API_FISICA = environment.apiUrl+"/LugaresRestringidos";



  constructor(private http:HttpClient) { 
    this.restriccionSeleccionada = new Restriccion();
  }


  /**
   * Obtiene la restriccion que contenga un id en particular 
   *  
   * @returns 
   */
  getByid(id : Number){
    return this.http.get(this.URL_API_GETByid+id);
  }

  /**
   * Obtiene la restriccion que contenga un id de grupo en particular 
   *  
   * @returns 
   */
  getByidGrupo(id : Number){
    return this.http.get(this.URL_API_GETByidGrupo+id);
  }



  /**
   * Obtiene las restricciones fisicas
   * @returns RestriccionFisica
   */
  getRestriccionesFisicas(){
    return this.http.get(this.URL_API_FISICA);
  }


  getRestricciones(){
    return this.http.get(this.URL_API_RESTRICCION_DTO);
  }

  postRestriccion(restriccion: Restriccion){
    return this.http.post(this.URL_API, restriccion);
  }
  
  getRestriccionesAdministrativo(email: string){
    return this.http.get(this.URL_API_RESTRICCION_DTO+"/"+email);
  }

  putRestriccion(restriccion: Restriccion){
    return this.http.put(this.URL_API, restriccion);
  }

  deleteRestriccion(idRestriccion: number){
    return this.http.delete(this.URL_API + "/borrar/" + idRestriccion);
  }

  getRestriccionesDamnificada(id: number){
    return this.http.get(this.URL_API_RESTRICCION_DTO+"/getByDamnificada/"+ id);
  }

  getRestriccionesVictimario(id: number){
    return this.http.get(this.URL_API_RESTRICCION_DTO+"/getByVictimario/"+ id);
  }

  getRestriccionesGrupo(id: number){
    return this.http.get(this.URL_API_RESTRICCION_DTO+"/getByIdGrupo/"+ id);
  }



}
