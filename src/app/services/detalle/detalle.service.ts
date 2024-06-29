import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { DetalleRestriccion } from 'src/app/models/detalle-restriccion';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})

export class DetalleService {

    detalles: DetalleRestriccion[];
    detalleSeleccionado: DetalleRestriccion;
    readonly URL_API = environment.apiUrl+'/DetalleRestricciones';
    readonly URL_API2 = environment.apiUrl+'DetalleRestricciones';
  
    constructor(private http: HttpClient) { }
  
  
    getDetalles(){
      return this.http.get(this.URL_API );
    }

    getDetalleXRes(idRestriccion: number): Observable<DetalleRestriccion> {
      return this.http.get<DetalleRestriccion>(this.URL_API + "/TraerRes/" + idRestriccion);
    }

  
    putDetalle(detalle: DetalleRestriccion){
      return this.http.put(this.URL_API+"/Update",  detalle);
    }

    postDetalle(detalle: DetalleRestriccion) {
      return this.http.post(this.URL_API+"/Agregar", detalle);
    }

    deleteDetalle(id: number) {
      return this.http.delete(this.URL_API2 + `/${id}`);
    }

    getByid(id: Number) {
      return this.http.get(this.URL_API + "/" + id);
    }
  
  }