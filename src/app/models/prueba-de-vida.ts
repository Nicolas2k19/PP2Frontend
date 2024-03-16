export class PruebaDeVida {

    constructor(idPruebaDeVida=0,fecha=null,descripcion='',estado='',idRestriccion=0,idPersonaRestriccion=0){
        this.idPruebaDeVida = idPruebaDeVida;
        this.fecha = fecha;
        this.descripcion = descripcion;
        this.estado = estado;
        this.idRestriccion = idRestriccion;
        this.idPersonaRestriccion = idPersonaRestriccion;
    }

    idPruebaDeVida: number;
    fecha: Date;
    descripcion: string;
    estado: string;
    idRestriccion: number;
    idPersonaRestriccion: number;
}
