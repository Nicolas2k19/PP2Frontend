import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Restriccion } from '../../models/restriccion';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import { environment } from '../../../environments/environment';
import RestriccionFisica from 'src/app/models/RestriccionFisica/RestriccionFisica';
import RestriccionFisicaEditar from 'src/app/models/RestriccionFisica/RestriccionFisicaEditar';
import RestriccionMultiple from 'src/app/models/RestriccionMultiple/RestriccionMultiple';

@Injectable({
  providedIn: 'root'
})

export class RestriccionService {

  restriccionSeleccionada: Restriccion;
  restricciones: RestriccionDTO[];
  readonly URL_API = environment.apiUrl + '/RestriccionPerimetral';
  readonly URL_API_RESTRICCION_DTO = environment.apiUrl + '/RestriccionDTO';
  readonly URL_API_GETByid = environment.apiUrl + "RestriccionPerimetral/getByRestriccion/";
  readonly URL_API_GETByidGrupo = environment.apiUrl + "RestriccionPerimetral/ObtenerPorIdGrupo/";
  readonly URL_API_FISICA = environment.apiUrl + "LugaresRestringidos";
  readonly URL_API_RES_MULTIPLE = environment.apiUrl + "RestriccionMultiple"

  constructor(private http: HttpClient) {
    this.restriccionSeleccionada = new Restriccion();
  }

  /**
   * Obtiene la restriccion que contenga un id en particular 
   *  
   * @returns 
   */
  getByid(id: Number) {
    return this.http.get(this.URL_API_GETByid + id);
  }

  /**
   * Obtiene la restriccion que contenga un id de grupo en particular 
   *  
   * @returns 
   */
  getByidGrupo(id: Number) {
    return this.http.get(this.URL_API_GETByidGrupo + id);
  }

  /**
   * Obtiene todas las restricciones multiples  
   * @author Nicolás
   */
  getRestriccionesMultiples() {
    return this.http.get(this.URL_API_RES_MULTIPLE)
  }

  /**
   * Obtiene las restricciones fisicas
   * @returns RestriccionFisica
   * @author Nicolás
   */
  getRestriccionesFisicas() {
    return this.http.get(this.URL_API_FISICA);
  }

  /**
     * Obtiene las restricciones fisicas por id
     * @returns RestriccionFisica
     * @author Nicolás
     */
  getRestriccionesFisicasPorId(idRestriccionFisica: Number) {
    return this.http.get(this.URL_API_FISICA + "/Restriccion/" + idRestriccionFisica);
  }

  /**
   * Obtiene las restricciones con la información adicional de la localidad y la provincia en la que se origino la restricción
   * @author Nicolás 
   */
  getRestriccionesConInfo() {
    return this.http.get(this.URL_API_FISICA + "/RplugarDto")
  }

  /**
  * Guarda una nueva restricción
  * @returns RestriccionFisica
  * @author Nicolás
  */
  postRestriccioFisica(restriccionFisica: RestriccionFisica) {
    return this.http.post(this.URL_API_FISICA, restriccionFisica);
  }

  /**
   * Guarda una nueva restricción multiple
   * @returns 
   */
  postRestriccionMultiple(restriccionMultiple: RestriccionMultiple) {
    return this.http.post(this.URL_API_RES_MULTIPLE + "/nuevaRestriccion", restriccionMultiple)
  }

  /**
   * Obtiene las restricciones multiples DTO
   * @author Nicolás
   */
  getRestriccionesMultiplesDTO() {
    return this.http.get(this.URL_API_RES_MULTIPLE + "/RestriccionMultipleDTO")
  }

  getRestricciones() {
    return this.http.get(this.URL_API_RESTRICCION_DTO);
  }

  postRestriccion(restriccion: Restriccion) {
    return this.http.post(this.URL_API, restriccion);
  }

  getRestriccionesAdministrativo(email: string) {
    return this.http.get(this.URL_API_RESTRICCION_DTO + "/" + email);
  }

  putRestriccion(restriccion: Restriccion) {
    return this.http.put(this.URL_API, restriccion);
  }

  deleteRestriccion(idRestriccion: number) {
    return this.http.delete(this.URL_API + "/borrar/" + idRestriccion);
  }

  /**
   * Elimina la restricción física que coincida con el id pasado por parámetro
   * @author Nicolás
   */
  deleteRestriccionFisica(restriccionId: Number) {
    return this.http.delete(this.URL_API_FISICA + "/" + restriccionId);
  }

  /**
   * Elimina la la restriccion multiple dado el id pasado por parametro
   * @author Nicolás
   */
  deleteRestriccionMultiple(idresMultiple: number) {
    return this.http.delete(this.URL_API_RES_MULTIPLE + "/eliminarRestriccion/" + idresMultiple);
  }

  /**
  * 
  * Update de la restriccion física 
  * @author Nicolás 
  */
  updateRestricciónFisica(restriccion: RestriccionFisicaEditar) {
    return this.http.put(this.URL_API_FISICA + "/" + restriccion.idRPLugar, restriccion);
  }

  getRestriccionesDamnificada(id: number) {
    return this.http.get(this.URL_API_RESTRICCION_DTO + "/getByDamnificada/" + id);
  }

  getRestriccionesVictimario(id: number) {
    return this.http.get(this.URL_API_RESTRICCION_DTO + "/getByVictimario/" + id);
  }

  getRestriccionesGrupo(id: number) {
    return this.http.get(this.URL_API_RESTRICCION_DTO + "/getByIdGrupo/" + id);
  }

}
