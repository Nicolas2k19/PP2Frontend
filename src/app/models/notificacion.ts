export class Notificacion {

    constructor(idNotificacion = 0, fecha=null, asunto='', descripcion='', estado='', idUsuario=0){
        this.idNotificacion = idNotificacion;
        this.fecha = fecha;
        this.asunto = asunto;
        this.descripcion = descripcion;
        this.estado = estado;
        this.idUsuario = idUsuario;
    }

    idNotificacion: number;
    fecha: Date;
    asunto: string;
    descripcion: string;
    estado: string;
    idUsuario: number;
}
