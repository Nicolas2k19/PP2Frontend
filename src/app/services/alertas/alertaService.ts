import { environment } from "src/environments/environment";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export default class AlertaService {

    readonly url = environment.apiUrl + "BotonAntipanico"

    constructor(private http: HttpClient) { }

    alertarPolicia(lat: number, lon: number, idrestriccion: number) {
        return this.http.post(this.url + `/alertarPolicia/${lat}/${lon}/${idrestriccion}`, "")
    }

}