import { Localidad } from "../localidad";
import { Provincia } from "../provincia";
import RestriccionFisicaEditar from "./RestriccionFisicaEditar";






export default class RestriccionConInfo{


    constructor(rpLugar = new RestriccionFisicaEditar(), provincia = new Provincia(), localidad = new Localidad() ){
        
    }
    rpLugar : RestriccionFisicaEditar
    provincia : Provincia
    localidad : Localidad

}