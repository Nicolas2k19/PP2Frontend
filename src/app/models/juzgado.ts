export class Juzgado {

    constructor(idJuzgado = 0, ciudad='',contacto='',direccion='',jurisdiccion='',nombre='') {
        this.idJuzgado = idJuzgado;
        this.ciudad = ciudad;
        this.contacto = contacto;
        this.direccion=direccion;
        this.jurisdiccion = jurisdiccion;
        this.nombre = nombre;
    }

    idJuzgado: number;
    ciudad: String
    direccion: String;
    contacto: String;
    jurisdiccion: String;
    nombre: String;

}
