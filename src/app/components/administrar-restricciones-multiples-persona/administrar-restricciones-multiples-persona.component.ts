import { Component,OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import RestriccionMultiple from 'src/app/models/RestriccionMultiple/RestriccionMultiple';
import RestriccionMultipleCompleta from 'src/app/models/RestriccionMultiple/RestriccionMultipleCompleta';
import RestriccionMultipleDTO from 'src/app/models/RestriccionMultiple/RestriccionMultipleDTO';
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
  styleUrls: ['./administrar-restricciones-multiples-persona.component.css' , '../styles/mas-info.css']

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
  restriccionesMultiples : RestriccionMultipleDTO[]
  restriccionesPerimetrales : Restriccion[]
  provincias : Provincia[]
  localidades : Localidad[]
  persona : Persona;

  idRestriccionMultipleAEditar : number;
  ordenIDRM: any;
  ordenProvincia: any;
  ordenLocalidad: any;
  ordenDireccion: any;
  ordenID: any;

  //Ventana modal
  modalAbierta: boolean;
  infoResIDM: number;
  infoResID: number;
  infoNacimiento: Date;
  infoNombrePersona: string;
  infoTelefono: string;
  infoDNI: string;
  infoDireccion: string;
  infoDepto: string;
  infoProvincia: string;
  infoLocalidad: string;
  infoDistancia: number;
  infoCodigoPostal: string;

  //filtros
  idFilter: null;
  idPadreFilter: null;
  originalRes: RestriccionMultipleDTO[] = [];
  showSelect: boolean;
 
 
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
   * @author Nicolás
   */
  traerRestriccionesMultiples(){
    this.restriccionService.getRestriccionesMultiplesDTO().subscribe(res =>{
      this.restriccionesMultiples = res as RestriccionMultipleDTO[]
      this.originalRes= res as RestriccionMultipleDTO[];
      console.log(this.restriccionesMultiples)
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

      this.traerRestriccionesMultiples();
    })

  }


 /** 
  * Busca la persona por el dni ingresado en el formulario de agregar y editar restricción multiple
  * @author Nicolás
  */
  buscarPersona(){
    if(this.editar) return

    if(!this.verificarCampos()) return;

      this.spinner.show()

      this.personaService.getDamnificadaByDNI(this.dni).subscribe(res =>{
        if(res==null) {
          this.manejarErrorLlamada("El dni ingresado no corresponde a una persona dentro de la aplicación, por favor, agregue a la nueva persona al sistema o ingrese correctamente el dni.")
          return;
        }
        this.persona = res as Persona;
        this.agregarRestriccionMultiple();
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

  /**
 * Crea una restricción multiple completa usando los datos del formulario.
 * @author Nicolás
 */
  crearRestriccionMultipleCompleta() : RestriccionMultipleCompleta{
    let restriccionCompleta : RestriccionMultipleCompleta = new RestriccionMultipleCompleta();
    restriccionCompleta.idRestriccionMultiple = this.idRestriccionMultipleAEditar
    restriccionCompleta.direccion = this.crearDireccion()
    restriccionCompleta.distancia = this.distancia;
    restriccionCompleta.idPersona = this.persona.idPersona;
    restriccionCompleta.idRestriccion = this.idPerimetral;
    restriccionCompleta.idProvincia = this.idProvincia;
    return restriccionCompleta;
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
  activarEdicion(restriccionMultiple : RestriccionMultipleDTO){
  this.editar = true;
  this.dni = restriccionMultiple.persona.dni;
  this.calle = restriccionMultiple.restriccionMultiple.direccion.calle
  this.altura = restriccionMultiple.restriccionMultiple.direccion.altura
  this.piso = restriccionMultiple.restriccionMultiple.direccion.piso
  this.departamento = restriccionMultiple.restriccionMultiple.direccion.departamento
  this.distancia = restriccionMultiple.restriccionMultiple.distancia;
  this.idPerimetral = restriccionMultiple.restriccionMultiple.idRestriccion;
  this.idProvincia = restriccionMultiple.provincia.idProvincia;
  this.idLocalidad = restriccionMultiple.localidad.idLocalidad;
  this.idRestriccionMultipleAEditar = restriccionMultiple.restriccionMultiple.idRestriccionMultiple
  this.persona = restriccionMultiple.persona;
  console.log(this.dni)
  }

  /**
   * Edita una restriccion multiple dados los parametros pasados por el formulario
   * @author Nicolás
   */
  editarRestriccionMultiple(){
    this.spinner.show()
    this.personaService.getDamnificadaByDNI(this.dni).subscribe(res =>{
      if(res == null){
        this.manejarErrorLlamada("El dni ingresado no corresponde a una persona dentro de la aplicación, por favor, agregue a la nueva persona al sistema o ingrese correctamente el dni")
        return;
      }
      this.verificarCampos();
      this.restriccionService.postRestriccionMultiple(this.crearRestriccionMultipleCompleta()).
      subscribe(res => {
        if(res = null){
          this.manejarErrorLlamada("Ha ocurrido un error al editar")
          return
        }
        this.toastr.success("Se ha editado correctamente")
        this.traerRestriccionesMultiples()
      })
      
      this.spinner.hide()
      
    })

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
     * @author Nicolás
     */
    manejarErrorLlamada(msj: string){
      this.toastr.error(msj)
      this.spinner.hide()
    }

    /**
     * Elimina una restriccion multiple
     * @author Nicolás
     */

    eliminarRestriccionMultiple(idRestriccionMultiple : number){   
      this.spinner.show()
      this.restriccionService.deleteRestriccionMultiple(idRestriccionMultiple).subscribe(res =>{
          this.spinner.hide();
          this.traerRestriccionesMultiples();
      });
    }





/**
 * Ordenamiento tablas
 */

ordenarPorRM(){

  let orden : number = this.ordenIDRM ?  1:-1

      let restriccion : RestriccionMultipleDTO[] = this.restriccionesMultiples;
      restriccion.sort((a,b)=>{
        if(a.restriccionMultiple.idRestriccionMultiple > b.restriccionMultiple.idRestriccionMultiple){
          return 1 * orden
        }
        return -1 * orden
      })

      this.ordenIDRM = !this.ordenIDRM;

}

ordenarPorID(){

  let orden : number = this.ordenID ?  1:-1

      let restriccion : RestriccionMultipleDTO[] = this.restriccionesMultiples;
      restriccion.sort((a,b)=>{
        if(a.restriccionMultiple.idRestriccion > b.restriccionMultiple.idRestriccion){
          return 1 * orden
        }
        return -1 * orden
      })

      this.ordenID = !this.ordenID;

}

ordenarPorDireccion(){
  let orden : number = this.ordenDireccion ?  1:-1

      let restriccion : RestriccionMultipleDTO[] = this.restriccionesMultiples;
      restriccion.sort((a,b)=>{
        if(a.restriccionMultiple.direccion.calle > b.restriccionMultiple.direccion.calle){
          return 1 * orden
        }
        return -1 * orden
      })

      this.ordenDireccion = !this.ordenDireccion;

}

ordenarPorLocalidad(){
  let orden : number = this.ordenLocalidad ?  1:-1

      let restriccion : RestriccionMultipleDTO[] = this.restriccionesMultiples;
      restriccion.sort((a,b)=>{
        if(a.localidad.nombre > b.localidad.nombre){
          return 1 * orden
        }
        return -1 * orden
      })

      this.ordenLocalidad = !this.ordenLocalidad;

}

ordenarPorProvincia(){
  let orden : number = this.ordenProvincia ?  1:-1

      let restriccion : RestriccionMultipleDTO[] = this.restriccionesMultiples;
      restriccion.sort((a,b)=>{
        if(a.provincia.nombre > b.provincia.nombre){
          return 1 * orden
        }
        return -1 * orden
      })

      this.ordenProvincia = !this.ordenProvincia;
  
}


/**VENTANA MODAL */

masInfo(restriccion: RestriccionMultipleDTO) {
 
  this.infoResIDM = restriccion.restriccionMultiple.idRestriccionMultiple;
  this.infoResID = restriccion.restriccionMultiple.idRestriccion;

  //Datos persona
  this.infoNombrePersona = restriccion.persona.nombre + " " + restriccion.persona.apellido;
  this.infoTelefono= restriccion.persona.telefono;
  this.infoNacimiento = restriccion.persona.fechaNacimiento;
  this.infoDNI = restriccion.persona.dni;


  //Datos domicilio
  this.infoDireccion = restriccion.restriccionMultiple.direccion.calle + " " + restriccion.restriccionMultiple.direccion.altura;
  this.infoDepto = restriccion.restriccionMultiple.direccion.piso + "-" + restriccion.restriccionMultiple.direccion.departamento;
  this.infoProvincia = restriccion.provincia.nombre;
  this.infoLocalidad = restriccion.localidad.nombre;
  this.infoDistancia = restriccion.restriccionMultiple.distancia;
  this.infoCodigoPostal = restriccion.localidad.codigoPostal;
 
   this.modalAbierta = true;
 }
 
 
 cerrarModal() {
 
   this.modalAbierta = false;
 }



//filtros


traerTodos(){
  this.traerRestriccionesMultiples();

  this.idPadreFilter = null;
  this.idFilter = null;
}

filtrarTodo(){
  let resultadosFiltrados = this.originalRes;

    // Filtrar por administrativo si el filtro de email está presente
    if (this.idPadreFilter) {
      resultadosFiltrados = resultadosFiltrados.filter(restriccion => 
        restriccion.restriccionMultiple.idRestriccion.toString() === this.idPadreFilter);
    }
  
    // Filtrar por damnificada si el filtro de DNI de damnificada está presente
    if (this.idFilter) {
      resultadosFiltrados = resultadosFiltrados.filter(restriccion => 
        restriccion.restriccionMultiple.idRestriccionMultiple.toString() === this.idFilter);
    }

    // Asignar los resultados finales al arreglo de restricciones

    this.restriccionesMultiples = resultadosFiltrados;



}


toggleSelect() {
  this.showSelect = !this.showSelect;
}




}






