import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Restriccion } from '../../models/restriccion';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class RestriccionService {

  restriccionSeleccionada: Restriccion;
  restricciones: RestriccionDTO[];  
  readonly URL_API = environment.apiUrl+'/RestriccionPerimetral';
  readonly URL_API_RESTRICCION_DTO = environment.apiUrl+'/RestriccionDTO';

  constructor(private http:HttpClient) { 
    this.restriccionSeleccionada = new Restriccion();
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

}
