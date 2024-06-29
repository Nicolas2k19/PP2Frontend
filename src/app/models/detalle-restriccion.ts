import { Comisaria } from "./comisaria";
import { Juzgado } from "./juzgado";
import { Restriccion } from "./restriccion";

export class DetalleRestriccion {

    constructor(idDetalle= 0,detalle = '', juez = '', comisaria = null, juzgado= null, restriccion =null) {
        this.idDetalle = idDetalle;
            this.detalle=detalle;
            this.juez=juez;
            this.comisaria =comisaria ;
            this.juzgado=juzgado;
            this.restriccion = restriccion;
    }
    idDetalle: number;
    detalle: string;
    juez: string;
    comisaria : Comisaria;
    juzgado: Juzgado;
    restriccion: Restriccion;
}
