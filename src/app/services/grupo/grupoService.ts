import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Grupo from 'src/app/models/grupo/Grupo';
import GrupoNuevo from 'src/app/models/grupo/grupoNuevo';



@Injectable({
    providedIn: 'root'
})
export default class GrupoService {

    readonly post = environment.apiUrl + '/grupo' + "/nuevoGrupo"
    readonly get = environment.apiUrl + '/grupo' + "/obtenerGrupos"
    readonly getById = environment.apiUrl + '/grupo' + "/obtenerGrupo/"
    readonly getAllById = environment.apiUrl + '/grupo' + "/obtenerGruposPorId/"


    readonly getByNombre = environment.apiUrl + '/grupo' + "/obtenerGrupoPorNombre/"

    readonly postEquipo = environment.apiUrl + '/grupo' + "/nuevoGrupo"


    private gruposMap: Map<Number, Grupo> = new Map();


    constructor(private http: HttpClient) {

        this.loadGrupos();
    }


    getGrupos() {
        return this.http.get(this.get)
    }


    getGrupo(idGrupo: Number) {
        return this.http.get(this.getById + idGrupo);
    }

    getGruposByID(idGrupo: Number) {
        return this.http.get(this.getAllById + idGrupo);
    }

    getGrupoByNombre(nombreGrupo: String) {
        return this.http.get(this.getByNombre + nombreGrupo);
    }


    crearEquipo(grupo: GrupoNuevo) {
        return this.http.post(this.postEquipo, grupo)
    }


    private loadGrupos() {
        this.http.get<Grupo[]>(this.get).subscribe(grupos => {
            grupos.forEach(grupo => {
                this.gruposMap.set(grupo.idGrupo, grupo);
            });
        });
    }

    public getNombreGrupo(idGrupo: Number): string {
        const grupo = this.gruposMap.get(idGrupo);
        return grupo ? `#${grupo.idGrupo} - ${grupo.nombreGrupo}` : 'Grupo no encontrado';
    }

}