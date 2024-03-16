export class Incidencia {

    constructor(idIncidencia = 0, fecha = null, descripcion = '', topico = '', idRestriccion = 0) {
            this.idIncidencia=idIncidencia;
            this.fecha=fecha;
            this.descripcion=descripcion;
            this.topico=topico;
            this.idRestriccion=idRestriccion;
    }

    idIncidencia: number;
    fecha: Date;
    descripcion: string;
    topico: string;
    idRestriccion: number;
}
