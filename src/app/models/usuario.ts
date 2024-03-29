export class Usuario {

    constructor(idUsuario = 0, email = '', contrasena = '123',rolDeUsuario = '',estadoUsuario='NO_CORRESPONDE'){
        this.idUsuario=idUsuario;
        this.email=email;
        this.contrasena=contrasena;
        this.rolDeUsuario=rolDeUsuario;
        this.estadoUsuario = estadoUsuario;
    }

    idUsuario: number;
    email: string;
    contrasena: string;
    rolDeUsuario: string;
    estadoUsuario : string;
}
