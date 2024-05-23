
export class PruebaDeVida {

    constructor(
        idPruebaDeVida: number = 0,
        fecha: Date | null = null,
        descripcion: string = '',
        estado: string = '',
        idRestriccion: number = 0,
        idPersonaRestriccion: number = 0,
        accion: string = '',
        esMultiple = false
    ) {
        this.idPruebaDeVida = idPruebaDeVida;
        this.fecha = fecha;
        this.descripcion = descripcion;
        this.estado = estado;
        this.idRestriccion = idRestriccion;
        this.idPersonaRestriccion = idPersonaRestriccion;
        this.accion = accion;
        this.esMultiple = esMultiple
    }

    idPruebaDeVida: number;
    fecha: Date | null;
    descripcion: string;
    estado: string;
    idRestriccion: number;
    idPersonaRestriccion: number;
    accion: string;
    esMultiple: boolean;
}
