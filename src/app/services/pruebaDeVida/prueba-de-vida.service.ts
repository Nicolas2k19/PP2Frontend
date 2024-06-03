import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PruebaDeVida } from 'src/app/models/prueba-de-vida';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PruebaDeVidaService {

  readonly URL_API = environment.apiUrl+'/PruebaDeVida';
  readonly URL_API_FOTO = environment.apiUrl+'/FotoPruebaDeVida';

  constructor(private http: HttpClient) { }

  getPruebasDeVidaPersona(idPersona: number){
    return this.http.get(this.URL_API + '/' + idPersona);
  }

  postPruebaDeVida(pruebaDeVida: PruebaDeVida){
    console.log(pruebaDeVida);
    return this.http.post(this.URL_API, pruebaDeVida);
  }

  putPruebaDeVida(pruebaDeVida: PruebaDeVida){
    return this.http.put(this.URL_API + "/" + pruebaDeVida.idPruebaDeVida, pruebaDeVida);
  }

  
  getFotoPruebaDeVida(idPruebaDeVida: number){
    return this.http.get(this.URL_API_FOTO+"/getFotoPruebaDeVida/"+idPruebaDeVida); 
   }

   getPruebaDeVidaByidPruebaDeVidaMultiple(idPruebaDeVidaMultiple: number){
    return this.http.get(this.URL_API+"/multiple/"+idPruebaDeVidaMultiple); 
   }


   getPruebasDeVida(){
    return this.http.get(this.URL_API);
  }
}
