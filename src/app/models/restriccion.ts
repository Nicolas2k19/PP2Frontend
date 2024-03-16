export class Restriccion {

    constructor(idRestriccion=0,idUsuario=0,idDamnificada=0,
        idVictimario=0,distancia=0,fechaSentencia=null){
            this.idRestriccion=idRestriccion;
            this.idUsuario=idUsuario;
            this.idDamnificada=idDamnificada;
            this.idVictimario=idVictimario;
            this.distancia=distancia;
            this.fechaSentencia=fechaSentencia;
    }

    idRestriccion: number;
    idUsuario: number;
    idDamnificada: number;
    idVictimario: number;
    distancia: number;
    fechaSentencia: Date;

}
