export class Direccion {

    constructor(idDireccion=0,calle='',altura='',piso='',departamento='',idLocalidad=2156){
        this.idDireccion=idDireccion;
        this.altura=altura;
        this.piso=piso;
        this.departamento=departamento;
        this.idLocalidad=idLocalidad;
    }

    idDireccion: number;
    calle: string;
    altura: string;
    piso: string;
    departamento: string;
    idLocalidad: number;
}
