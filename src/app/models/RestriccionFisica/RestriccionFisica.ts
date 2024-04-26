import { Direccion } from "../direccion";






export default class RestriccionFisica{


    constructor(idRestriccion=0,nombre ="", direccion = new Direccion,longitud="",latitud=0,distancia=200){
        
    }
    idRestriccion : number
    nombre : string
    direccion : Direccion
    longitud : number
    latitud : number
    distancia : number

}