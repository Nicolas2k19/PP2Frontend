export class FotoIdentificacion {

    constructor(idFoto = 0, foto = null , idPersona = 0){
        this.idFoto=idFoto;
        this.foto=foto;
        this.idPersona=idPersona;
    }

    idFoto: number;
    foto: string;
    idPersona: number;
}
