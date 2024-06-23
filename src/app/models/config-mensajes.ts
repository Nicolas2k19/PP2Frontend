export class ConfigMensaje {

    constructor(idMensaje = 0, asunto = '', mensajeAft = '', mensajeBef = '', tipo= '') {
            this.idMensaje=idMensaje;
            this.asunto=asunto;
            this.mensajeAft=mensajeAft;
            this.mensajeBef =mensajeBef ;
            this.tipo=tipo;
    }

    idMensaje: number;
    asunto: string;
    mensajeAft: string;
    mensajeBef : string;
    tipo: string;
}
