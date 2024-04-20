export class Incidencia {

    constructor(idIncidencia = 0, fecha = null, descripcion = '', topico = '', idRestriccion = 0, peligrosidad= '') {
            this.idIncidencia=idIncidencia;
            this.fecha=fecha;
            this.descripcion=descripcion;
            this.topico=topico;
            this.idRestriccion=idRestriccion;
            this.peligrosidad = peligrosidad;
    }

    idIncidencia: number;
    fecha: Date;
    descripcion: string;
    topico: string;
    idRestriccion: number;
    peligrosidad: string;
}
