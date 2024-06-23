import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Juzgado } from 'src/app/models/juzgado';

@Injectable({
  providedIn: 'root'
})

export class JuzgadoService {

    juzgados: Juzgado[];
    juzgadoSeleccionado: Juzgado;
    readonly URL_API = environment.apiUrl+'/Juzgado';
  
    constructor(private http: HttpClient) { }
  
  
    getJuzgados(){
      return this.http.get(this.URL_API);
    }
  
    putJuzgado(juzgado: Juzgado){
      return this.http.put(this.URL_API, juzgado);
    }

    postJuzgado(juzgado: Juzgado) {
      return this.http.post(this.URL_API, juzgado);
    }

    deleteJuzgado(id: number) {
      return this.http.delete(this.URL_API + `/${id}`);
    }
  
  }