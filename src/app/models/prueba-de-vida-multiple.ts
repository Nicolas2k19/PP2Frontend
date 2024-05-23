import { PruebaDeVida } from "./prueba-de-vida";

export class PruebaDeVidaMultiple {

    constructor(id=0,descripcion='', idPruebaDeVida=0){
        this.id = id;
        this.descripcion = descripcion;
        this.idPruebaDeVida =idPruebaDeVida;
    }

    id: number;
    descripcion: string;
    idPruebaDeVida: number;
}
