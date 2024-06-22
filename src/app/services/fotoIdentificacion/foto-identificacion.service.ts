import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FotoIdentificacion } from 'src/app/models/foto-identificacion';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FotoIdentificacionService {

  fotoIdentificacion: FotoIdentificacion;
  readonly URL_API = environment.apiUrl+'/FotoIdentificacion';

  constructor(private http: HttpClient) {
    this.fotoIdentificacion = new FotoIdentificacion;
  }

  postFotoIdentificacion(foto: FotoIdentificacion){
    var fd = new FormData();
    fd.append("file", foto.foto);
    fd.append("idPersona", foto.idPersona.toString());
    return this.http.post(this.URL_API, fd);
  }

  postpr(datos64: string, idPersona: string){
    var fd = new FormData();
    fd.append("foto", datos64);
    fd.append("idPersona", idPersona);
    return this.http.post(this.URL_API, fd);
  }
  
  getFotoPefil(idVictimario: number){
    return this.http.get(this.URL_API+"/getFoto/"+idVictimario); 
   }

}
