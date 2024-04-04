
export  default class Grupo {

    constructor(idGrupo = 0,horaFinal="" ,horaInicial="" ,idRestriccion=0,idUsuario=0){
        this.idGrupo=idGrupo;
        this.horaFinal = horaFinal
        this.horaInicial = horaInicial
        this.idRestriccion = idRestriccion
        this.idUsuario = idUsuario;
    }
    idGrupo: Number;
    horaFinal : string
    horaInicial : string
    idRestriccion : Number
    idUsuario : Number;
}


