import { Persona } from './persona';
import { Usuario } from './usuario';
import { Direccion } from './direccion';

export class FormPersonaDTO {

    constructor(persona= new Persona, usuario= new Usuario, direccion = new Direccion, foto = "",lat=0,lon=0){
        this.persona=persona;
        this.usuario=usuario;
        this.direccion=direccion;
        this.foto=foto;
        this.lat=lat;
        this.lon=lon;
    }

    persona: Persona;
    usuario: Usuario;
    direccion: Direccion;
    foto: string;
    lat: number;
    lon: number;
}
