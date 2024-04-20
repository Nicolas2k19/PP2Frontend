import { Injectable } from '@angular/core';
import { FormPersonaDTO } from 'src/app/models/form-persona-dto';
import { HttpClient } from '@angular/common/http';
import { Persona } from 'src/app/models/persona';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  personaDTOSelleccionada: FormPersonaDTO;
  personas: FormPersonaDTO[];
  readonly URL_API = environment.apiUrl+'/FormABMPersona';
  readonly URL_API_PERSONA = environment.apiUrl+'/Persona';


  constructor(private http: HttpClient) {
    this.personaDTOSelleccionada = new FormPersonaDTO;
  }

  getPersonas(){
    return this.http.get(this.URL_API);
  }

  getPersona(id : number){
    return this.http.get(this.URL_API_PERSONA+'/GetById/'+id);
  }

  postPersona(personaDTO: FormPersonaDTO){
    console.log(personaDTO);
    return this.http.post(this.URL_API, personaDTO);
  }

  getVictimarioByDNI(dni: string){
    return this.http.get<Persona>(this.URL_API_PERSONA+"/GetVictimarioByDni/"+dni);
  }

  getDamnificadaByDNI(dni: string){
    return this.http.get<Persona>(this.URL_API_PERSONA+"/GetDamnificadaByDni/"+dni);
  }

  deletePersona(id: number){
    return this.http.delete(this.URL_API + "/" + id);
  }

  putPersona(personaDTO: FormPersonaDTO){
    console.log("Me estoy llamando")
    return this.http.put(this.URL_API + "/ModificarPersona", personaDTO);
  }

}
