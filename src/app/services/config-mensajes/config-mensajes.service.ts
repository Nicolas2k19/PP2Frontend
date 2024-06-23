import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ConfigMensaje } from 'src/app/models/config-mensajes';


@Injectable({
  providedIn: 'root'
})
export class ConfigurarMensajesService {

  mensajes: ConfigMensaje[];
  readonly URL_API = environment.apiUrl+'/configMensaje';

  constructor(private http: HttpClient) { }

  getMensajePorTipo(tipo: string){
    return this.http.get(this.URL_API + '/' + tipo );
  }

  getMensajes(){
    return this.http.get(this.URL_API);
  }

  putMensaje(mensaje: ConfigMensaje){
    return this.http.put(this.URL_API, mensaje);
  }

}