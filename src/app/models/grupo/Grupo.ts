
export  default class Grupo {

    constructor(idGrupo=3, nombreGrupo = '', turnoGrupo = ''  ,idRestriccion=0,idUsuario=0){
        this.idGrupo=idGrupo;
        this.idRestriccion = idRestriccion
        this.idUsuario = idUsuario;
        this.nombreGrupo = nombreGrupo;
        this.turnoGrupo = turnoGrupo
    }
    idGrupo: Number;
    nombreGrupo : String
    turnoGrupo : String
    idRestriccion : Number
    idUsuario : Number;
}


