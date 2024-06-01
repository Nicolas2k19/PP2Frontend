import { PruebaDeVida } from "./prueba-de-vida";

export class PruebaDeVidaMultiple {

    constructor(idPruebaDeVidaMultiple=0,descripcion='',idPersona = 0, estado=''){
        this.idPruebaDeVidaMultiple = idPruebaDeVidaMultiple;
        this.descripcion = descripcion;
        this.idPersona = idPersona;
        this.estado = estado;
    }

    idPruebaDeVidaMultiple: number;
    descripcion: string;
    idPersona: number;
    estado: string;
}
