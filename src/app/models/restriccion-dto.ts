import { Persona } from './persona';
import { Usuario } from './usuario';
import { Restriccion } from './restriccion';

export class RestriccionDTO {
    constructor(victimario=new Persona, damnificada=new Persona, administrativo=new Usuario,
        restriccion=new Restriccion){
            this.victimario = victimario;
            this.damnificada = damnificada;
            this.administrativo = administrativo;
            this.restriccion = restriccion;
    }

    victimario: Persona;
    damnificada: Persona;
    administrativo: Usuario;
    restriccion: Restriccion;

}
