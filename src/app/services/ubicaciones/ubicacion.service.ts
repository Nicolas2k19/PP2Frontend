import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UbicacionDto } from 'src/app/models/ubicacion-dto';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  readonly URL_API = environment.apiUrl+'/Ubicacion';
  readonly URL_API_UBICACION_RUTINA = environment.apiUrl+'/UbicacionRutina';

  constructor(private http: HttpClient) { }


  getUbicacionPorIdPersona(idPersona : number){
    return this.http.get(this.URL_API +"/"+idPersona )
  }

  getUbicacionesRestriccion(idRestriccion: number) {
    return this.http.get(this.URL_API + "/getByRestriccion/" + idRestriccion);
  }

  getEstaInfringiendo(idRestriccion: number, ubicacionDTO: UbicacionDto) {
    return this.http.post(this.URL_API + "/infringe/" + idRestriccion, ubicacionDTO);
  }

  getUbicacionPromedioRutina(idPersona: number, dia: number, hora: number, minutos: number) {
    return this.http.get(this.URL_API_UBICACION_RUTINA+'/persona=' + idPersona +
      "/dia=" + dia + "/hora=" + hora + "/minutos=" + minutos);
  }

}
