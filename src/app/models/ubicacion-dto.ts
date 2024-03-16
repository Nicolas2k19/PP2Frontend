import { Ubicacion } from './ubicacion';

export class UbicacionDto {

    constructor(ubicacionDamnificada = new Ubicacion, ubicacionVictimario = new Ubicacion) {
        this.ubicacionDamnificada = ubicacionDamnificada;
        this.ubicacionVictimario = ubicacionVictimario;
    }

    ubicacionDamnificada: Ubicacion;
    ubicacionVictimario: Ubicacion;
}
