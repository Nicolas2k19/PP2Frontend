import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PruebaDeVidaMultiple } from 'src/app/models/prueba-de-vida-multiple';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PruebaDeVidaMultipleService {

  readonly URL_API = environment.apiUrl+'/PruebaDeVidaMultiple';

  constructor(private http: HttpClient) { }

   postPruebaDeVidaMultiple(pruebaDeVidaMultiple: PruebaDeVidaMultiple){
    return this.http.post(this.URL_API, pruebaDeVidaMultiple);
  }

  getPruebasDeVidaMultiples(idPersona:number){
    return this.http.get(this.URL_API+'/getAll/'+idPersona);
  }

  actualizarEstadoPruebaDeVida(idPruebaDeVida: number, nuevoEstado: string){
    return this.http.put(this.URL_API + "/estado/" + idPruebaDeVida, { estado: nuevoEstado });
  }
}
