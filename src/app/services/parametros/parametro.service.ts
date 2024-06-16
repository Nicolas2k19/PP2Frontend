import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Parametro } from 'src/app/models/parametro';


@Injectable({
  providedIn: 'root'
})
export class ParametroService {

  readonly URL_API = environment.apiUrl+'/Parametro';

  constructor(private http: HttpClient) {
  }

  getById(id : number){
    return this.http.get(this.URL_API+"/"+id)
  }

  update(id : number, parametro : Parametro){
    return this.http.put(this.URL_API+"/"+id,parametro)
  }
}
