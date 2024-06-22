export class Ubicacion {

    constructor(idUbicacion = 0, latitud = 0, longitud = 0, fecha = null, idPersona = 0) {
        this.idUbicacion = idUbicacion;
        this.latitud = latitud;
        this.longitud = longitud;
        this.fecha = fecha;
        this.idPersona = idPersona;
    }

    idUbicacion: number;
    latitud;
    longitud;
    fecha: Date;
    idPersona: number;

}
