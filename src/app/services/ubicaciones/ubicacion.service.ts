import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UbicacionDto } from 'src/app/models/ubicacion-dto';
import { environment } from '../../../environments/environment';
import { Ubicacion } from 'src/app/models/ubicacion';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  readonly URL_API = environment.apiUrl + '/Ubicacion';
  readonly URL_API_UBICACION_RUTINA = environment.apiUrl + '/UbicacionRutina';
  constructor(private http: HttpClient) { }

  getUbicacionPorIdPersona(idPersona: number) {
    return this.http.get(this.URL_API + "/" + idPersona)
  }

  getUbicacionesRestriccion(idRestriccion: number) {
    return this.http.get(this.URL_API + "/getByRestriccion/" + idRestriccion);
  }

  getEstaInfringiendo(idRestriccion: number, ubicacionDTO: UbicacionDto) {
    return this.http.post(this.URL_API + "/infringe/" + idRestriccion, ubicacionDTO);
  }

  /**
  * Retorna un booleano informando si una restricción multiple esta siendo violada, se le debe pasar la distancia
  * @author Nicolás
  */
  getEstaInfringiendoPasandoDistancia(distancia: number, ubicacionDTO: UbicacionDto) {
    return this.http.post(this.URL_API + "/infringePasandoDistancia/" + distancia, ubicacionDTO);
  }

  /**
   * Retorna un booleano que informa si una restricción fisica esta siendo violada
   * @author Nicolás
   */
  getInfringeRestriccionFisica() {
  }

  /**
  * Retorna un booleano informando si una restricción multiple esta siendo violada
  * @author Nicolás
  */
  getInfringeRestriccionMultiple() {
  }

  getUbicacionPromedioRutina(idPersona: number, dia: number, hora: number, minutos: number) {
    return this.http.get(this.URL_API_UBICACION_RUTINA + '/persona=' + idPersona +
      "/dia=" + dia + "/hora=" + hora + "/minutos=" + minutos);
  }

  postUbicacion(ubicacion: Ubicacion) {
    return this.http.post(this.URL_API, ubicacion)
  }
}
