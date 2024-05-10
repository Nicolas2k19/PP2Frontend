import { Localidad } from "../localidad"
import { Persona } from "../persona"
import { Provincia } from "../provincia"
import RestriccionMultiple from "./RestriccionMultiple"
import RestriccionMultipleCompleta from "./RestriccionMultipleCompleta"

export default class RestriccionMultipleDTO{


    constructor(restriccionMultiple= new RestriccionMultipleCompleta(), provincia= new Provincia(),localidad = new Localidad(),persona= new Persona()){
    
    }
    
        restriccionMultiple : RestriccionMultipleCompleta
        provincia : Provincia
        localidad : Localidad
        persona : Persona

    }
    
    
    
    