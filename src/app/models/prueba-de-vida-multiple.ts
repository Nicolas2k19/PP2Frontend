
export class PruebaDeVidaMultiple {

    constructor(idPruebaDeVidaMultiple=0,descripcion='',idPersona = 0, estado='', tiempoDeRespuesta= null){
        this.idPruebaDeVidaMultiple = idPruebaDeVidaMultiple;
        this.descripcion = descripcion;
        this.idPersona = idPersona;
        this.estado = estado;
        this.tiempoDeRespuesta = tiempoDeRespuesta;
    }

    idPruebaDeVidaMultiple: number;
    descripcion: string;
    idPersona: number;
    estado: string;
    tiempoDeRespuesta: Date | null;
}
