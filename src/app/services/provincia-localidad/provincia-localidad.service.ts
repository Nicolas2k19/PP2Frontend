import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProvinciaLocalidadService {

  readonly URL_API = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getProvincias() {
    return this.http.get(this.URL_API + '/Provincias');
  }

  getLocalidades(idProvincia: number) {
    return this.http.get(this.URL_API + '/Localidad/' + idProvincia);
  }

  getLocalidad(idLocalidad: number) {
    return this.http.get(this.URL_API + '/Localidad/Buscar/' + idLocalidad);
  }
}
