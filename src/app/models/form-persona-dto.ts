import { Persona } from './persona';
import { Usuario } from './usuario';
import { Direccion } from './direccion';

export class FormPersonaDTO {

    constructor(persona= new Persona, usuario= new Usuario, direccion = new Direccion, foto = ""){
        this.persona=persona;
        this.usuario=usuario;
        this.direccion=direccion;
        this.foto=foto;
    }

    persona: Persona;
    usuario: Usuario;
    direccion: Direccion;
    foto: string;
}
