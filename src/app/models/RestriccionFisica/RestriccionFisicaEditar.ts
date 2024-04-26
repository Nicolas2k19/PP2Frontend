import { Direccion } from "../direccion";






export default class RestriccionFisicaEditar{


    constructor(idRPLugar=0,idRestriccion=0,nombre ="", direccion = new Direccion,longitud="",latitud=0,distancia=200){
        
    }
    idRPLugar : number
    idRestriccion : number
    nombre : string
    direccion : Direccion
    longitud : number
    latitud : number
    distancia : number

}