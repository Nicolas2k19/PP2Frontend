export class Localidad {

    constructor(idLocalidad=0,nombre='',codigoPostal='',idProvincia=0){
        this.idLocalidad=idLocalidad;
        this.nombre=nombre;
        this.codigoPostal=codigoPostal;
        this.idProvincia=idProvincia;
    }

    idLocalidad: number;
    nombre: string;
    codigoPostal: string;
    idProvincia: number;
}
