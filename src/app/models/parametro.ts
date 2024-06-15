export class Parametro {

    constructor(idParametro = 0, nombre = '', valor= '') {
            this.idParametro=idParametro;
            this.nombre=nombre;
            this.valor=valor;
    }

    idParametro: number;
    nombre: string;
    valor: string;
}
