import { Component,OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import RestriccionMultiple from 'src/app/models/RestriccionMultiple/RestriccionMultiple';
import { Direccion } from 'src/app/models/direccion';
import { Localidad } from 'src/app/models/localidad';
import { Persona } from 'src/app/models/persona';
import { Provincia } from 'src/app/models/provincia';
import { Restriccion } from 'src/app/models/restriccion';
import { PersonaService } from 'src/app/services/personas/persona.service';
import { ProvinciaLocalidadService } from 'src/app/services/provincia-localidad/provincia-localidad.service';
import { RestriccionService } from 'src/app/services/restricciones/restriccion.service';

@Component({
  selector: 'app-administrar-restricciones-multiples-persona',
  templateUrl: './administrar-restricciones-multiples-persona.component.html',
  styleUrl: './administrar-restricciones-multiples-persona.component.css'
})
export class AdministrarRestriccionesMultiplesPersonaComponent implements OnInit{
 

  editar : boolean
  dni : string
  calle: string;
  piso : string
  idPerimetral : number
  idProvincia : number
  idLocalidad : number
  departamento : string
  altura : string
  distancia : number
  restriccionesMultiples : RestriccionMultiple[]
  restriccionesPerimetrales : Restriccion[]
  provincias : Provincia[]
  localidades : Localidad[]
  persona : Persona;
 
 
  constructor(public personaService :PersonaService,
    public provinciaLocalidadService : ProvinciaLocalidadService 
    ,public restriccionService:  RestriccionService
    ,private toastr: ToastrService,
    private spinner: NgxSpinnerService){
    this.editar = false;
  }
 
  
  
  ngOnInit(): void {
    this.traerRestriccionesPerimetrales()
    this.traerProvincias()
    this.traerRestriccionesMultiples()
  }


  /**
   * Trae las restricciones multiple disponibles
   */
  traerRestriccionesMultiples(){
    this.restriccionService.getRestriccionesMultiples().subscribe(res =>{
      this.restriccionesMultiples = res as RestriccionMultiple[]
    })
  }

  /**
   * Este método trae las restricciones perimetrales actuales
   * @author Nicolás
   */
  traerRestriccionesPerimetrales(){
    this.restriccionService.getRestricciones().subscribe(res => {
      this.restriccionesPerimetrales = res as Restriccion[]
      console.log(this.restriccionesPerimetrales)
    })
  }

  /**
   * Este método trae las provincias disponibles
   * @author Nicolás
   */
  traerProvincias(){
    this.provinciaLocalidadService.getProvincias().subscribe(res => {
      this.provincias = res as Provincia[]
      console.log(this.provincias)
    })

  }

  /**
   * Este método trae las localidades disponibles
   * @author Nicolás
   */
  traerLocalidades(){
    if(this.idProvincia==undefined) {
      this.toastr.error("Por favor,selecciona una provincia.")
      return;
    }

    this.provinciaLocalidadService.getLocalidades(this.idProvincia).subscribe(res => {
      this.localidades = res as Localidad[]
      console.log(this.localidades)
    })

  }


  /**
   * Agrega una nueva restricción multiple
   * @author Nicolás
   */
  agregarRestriccionMultiple(){
    if(this.editar) return;
    
    console.log("Llega a agregar")

    this.restriccionService.postRestriccionMultiple(this.crearRestriccionMultiple())
    .subscribe( res =>{ 

      console.log("Estoy funcionando bro")

      if(res==null){
         this.toastr.error("Ha ocurrido un error al intentar agregar la restricción multiple")

        }

      else this.toastr.success("Se ha agregado la persona correctamente")

      console.log("FUNCIONEEEEEEEEEEEEEEEEEEEEEEEEEEEE")

      console.log(res)
    })

  }


 /** 
  * Busca la persona por el dni ingresado en el formulario de agregar y editar restricción multiple
  * @author Nicolás
  */
  buscarPersona(){

    if(!this.verificarCampos()) return;

      this.spinner.show()

      this.personaService.getDamnificadaByDNI(this.dni).subscribe(res =>{
        if(res==null) {
          this.manejarErrorLlamada("El dni ingresado no existe.")
          return;
        }

        this.persona = res as Persona;

        if(!this.editar) this.agregarRestriccionMultiple();
        
        else console.log("Tengo que editar")


        console.log("Que paso? LLegaste bro")
        this.spinner.hide()
    })

  }





/**
 * Crea una restricción multiple usando los datos del ngModel
 * @author Nicolás
 */

  crearRestriccionMultiple() :  RestriccionMultiple{
      let resMultiple : RestriccionMultiple = new RestriccionMultiple()

      console.log("Llegue a crear RESTRICCION MULTIPLE")

      resMultiple.direccion = this.crearDireccion()

      resMultiple.distancia = this.distancia;

      resMultiple.idPersona = this.persona.idPersona;

      resMultiple.idRestriccion = this.idPerimetral;

      resMultiple.idProvincia = this.idProvincia;


      console.log("CREÉ LA RESTRICCIÓN MULTIPLE SACO DE WEA")

      return resMultiple;

  }

  crearDireccion(){
    let nuevaDireccion : Direccion = new Direccion()

    console.log("Llegue a crear dirección")
    
    nuevaDireccion.departamento = this.departamento
    console.log("eRROR DEPA")
    nuevaDireccion.calle = this.calle;
    console.log("eRROR CALLE")
    nuevaDireccion.altura = this.altura;
    console.log("eRROR ALTURA")
    nuevaDireccion.idLocalidad = this.idLocalidad;
    console.log("eRROR LOCALIDAD")
    nuevaDireccion.piso = this.piso
    console.log("eRROR PISO")

    console.log("Creé la dirección hdp")

    return nuevaDireccion;
  }



  /**
   * Activa la edición en la pantalla de restricciones multiples
   * @author Nicolás
   */
  activarEdicion(){
  this.editar = true;
  }

  /**
   * Desactiva la edición en la pantalla de restricciones multiples
   * @author Nicolás
   */
  desactivarEdicion(){
    this.editar = false;
    }


  /**
   * Verifica que los campos no esten vacíos
   * @author Nicolás
   */
  verificarCampos(){
      if(this.campoVacio(this.dni)) this.toastr.error("No se ingreso el dni.")

      if(this.campoVacio(this.calle)) this.toastr.error("No se ingreso la calle.")

      if(this.campoVacio(this.altura)) this.toastr.error("No se ingreso la altura.")

      if(this.campoVacio(this.piso)) this.toastr.error("No se ingreso el piso.")

      if(this.campoVacio(this.departamento)) this.toastr.error("No se ingreso el departamento.")

      if(this.campoVacio(this.idPerimetral+"")) this.toastr.error("No se ingreso la perimetral.")

      if(this.campoVacio(this.idProvincia+"")) this.toastr.error("No se ingreso la provincia.")

      if(this.campoVacio(this.idLocalidad+"")) this.toastr.error("No se ingreso la localidad.")

      if(this.campoVacio(this.distancia+"")) this.toastr.error("No se ingreso la distancia.")
      
      
        return !this.campoVacio(this.dni)
               &&!this.campoVacio(this.calle)
               &&!this.campoVacio(this.altura)
               &&!this.campoVacio(this.piso)
               &&!this.campoVacio(this.departamento)
               &&!this.campoVacio(this.idPerimetral+"")
               &&!this.campoVacio(this.idLocalidad+"")
               &&!this.campoVacio(this.departamento+"")
               &&!this.campoVacio(this.distancia+"")
               &&!this.campoVacio(this.idProvincia+"");
   
    }

    /**
     * Verifica que el campo pasado como argumento sea vacio o no
     * @author Nicolás
     */
    campoVacio(campo : string){

      console.log(campo);
      console.log(campo==undefined);

      if(campo=="undefined") return true;

      if(campo=="") return true;


      return false;
    }


    /**
     * Maneja el error al hacer una llamada que falle
     */
    manejarErrorLlamada(msj: string){
      this.toastr.error(msj)
      this.spinner.hide()
    }

/**
 * Ordenamiento tablas
 */

ordenarPorRM(){

}

ordenarPorID(){

}

ordenarPorDireccion(){

}

ordenarPorLocalidad(){

}

ordenarPorProvincia(){
  
}




}






