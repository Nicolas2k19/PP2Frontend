import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Comisaria } from 'src/app/models/comisaria';

@Injectable({
  providedIn: 'root'
})

export class ComisariaService {

    comisarias: Comisaria[];
    comisariaSeleccionado: Comisaria;
    readonly URL_API = environment.apiUrl+'/Comisaria';
  
    constructor(private http: HttpClient) { }
  
  
    getComisarias(){
      return this.http.get(this.URL_API +"/ObtenerComisarias");
    }
  
    putComisaria(comisaria: Comisaria){
      return this.http.put(this.URL_API,  comisaria);
    }

    postComisaria(comisaria: Comisaria) {
      return this.http.post(this.URL_API, comisaria);
    }

    deleteComisaria(id: number) {
      return this.http.delete(this.URL_API + `/${id}`);
    }

    getByid(id: Number) {
      return this.http.get(this.URL_API + "/" + id);
    }
  
  }