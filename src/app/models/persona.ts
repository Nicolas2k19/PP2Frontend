export class Persona {

    constructor(idPersona = 0, nombre = '', apellido = '', DNI = '', telefono = '', fechaNacimiento = null,
        idDireccion = 0, idUsuario=0) {
            this.idPersona=idPersona;
            this.nombre=nombre;
            this.apellido=apellido;
            this.dni=DNI;
            this.telefono=telefono;
            this.fechaNacimiento=fechaNacimiento;
            this.idDireccion=idDireccion;
            this.idUsuario=idUsuario;
    }

    idPersona: number;
    nombre: string;
    apellido: string;
    dni: string;
    telefono: string;
    fechaNacimiento: Date;
    idDireccion: number;
    idUsuario: number;
}
