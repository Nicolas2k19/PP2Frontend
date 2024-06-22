import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Incidencia } from 'src/app/models/incidencia';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class IncidenciaService {

  incidencias: Incidencia[];
  readonly URL_API = environment.apiUrl+'/Incidencia';

  constructor(private http: HttpClient) { }

  getIncidenciasPorTopico(topico: string, cant: number){
    return this.http.get(this.URL_API + '/' + topico + '/' + cant);
  }

  getIncidenciasPorRestriccion(idRestriccion: number, cant: number){
    return this.http.get(this.URL_API + '/' + idRestriccion + '/' + cant);
  }

  updateIncidencia(incidencia : Incidencia){
    return this.http.post(this.URL_API + "/agregar", incidencia);
  }

  getIncidencias(){
    return this.http.get(this.URL_API);
  }
}
