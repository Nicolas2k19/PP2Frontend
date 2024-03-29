export class Usuario {

    constructor(idUsuario = 0, email = '', contrasena = '123',rolDeUsuario = '',estado=''){
        this.idUsuario=idUsuario;
        this.email=email;
        this.contrasena=contrasena;
        this.rolDeUsuario=rolDeUsuario;
        this.estado = estado;
    }

    idUsuario: number;
    email: string;
    contrasena: string;
    rolDeUsuario: string;
    estado : string;
}
