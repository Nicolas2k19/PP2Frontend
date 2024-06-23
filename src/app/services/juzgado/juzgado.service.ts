import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Juzgado } from 'src/app/models/juzgado';

@Injectable({
  providedIn: 'root'
})

export class JuzgadoService {

    juzgado: Juzgado[];
    readonly URL_API = environment.apiUrl+'/Juzgado';
  
    constructor(private http: HttpClient) { }
  
  
    getJuzgado(){
      return this.http.get(this.URL_API);
    }
  
    putJuzgado(juzgado: Juzgado){
      return this.http.put(this.URL_API, juzgado);
    }
  
  }