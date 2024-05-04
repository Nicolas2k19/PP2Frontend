import { Component, OnInit } from '@angular/core';
import { NgForm,FormsModule } from '@angular/forms';
import RestriccionFisica from 'src/app/models/RestriccionFisica/RestriccionFisica';
import { Localidad } from 'src/app/models/localidad';
import {Provincia}  from 'src/app/models/provincia';
import { ProvinciaLocalidadService } from 'src/app/services/provincia-localidad/provincia-localidad.service';
import { RestriccionService } from 'src/app/services/restricciones/restriccion.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Direccion } from 'src/app/models/direccion';
import { ToastrService } from 'ngx-toastr';
import { Restriccion } from 'src/app/models/restriccion';
import { CommonModule } from '@angular/common';
import RestriccionFisicaEditar from 'src/app/models/RestriccionFisica/RestriccionFisicaEditar';
import RestriccionConInfo from 'src/app/models/RestriccionFisica/RestriccionConInfo';

@Component({
  selector: 'app-administrar-restricciones-fisicas',
  templateUrl: './administrar-restricciones-fisicas.component.html',
  styleUrls: ['./administrar-restricciones-fisicas.component.css'],
})


export class AdministrarRestriccionesFisicasComponent implements OnInit{
  

  ordenId : boolean;
  restriccionesConInfo : RestriccionConInfo[]
  restriccionesFisicasAMostrar : RestriccionFisicaEditar[]
  provincias : Provincia[]
  provinciaSeleccionada : number;
  localidadSeleccionada : number;
  restriccionSeleccionada : number
  editar: Boolean;
  nombreRestriccion : string;
  calle: string;
  piso : string
  departamento : string
  altura : string
  distancia : number
  localidades : Localidad[]
  restriccionesPerimetrales : Restriccion[]
  restriccionAEditar : number
  
  ordenNombre: boolean;
  ordenLocalidad: boolean;
  ordenProvincia: boolean;
  ordenDireccion: boolean;
  

  constructor(public restriccionService : RestriccionService,
      public provinciaLocalidadService : ProvinciaLocalidadService,
      private toastr: ToastrService,
      private spinner: NgxSpinnerService){
      this.provincias = [];
      this.editar = false;
      this.ordenId  = false;
      this.ordenNombre = false;
      this.ordenLocalidad = false;
      this.ordenProvincia = false;

     

      
  }
 
  

  
  ngOnInit(): void {
    this.obtenerRestriccionesFisicasConInfo();
    this.obtenerRestriccionesFisicas();
    this.obtenerRestriccionesPerimetrales()
    this.obtenerProvincias();
    this.obtenerLocalidades();
  }


  /**
   * Obtiene las restricciones fisicas, con la información de la provincia y localidad
   * @author Nicolás
   */
  obtenerRestriccionesFisicasConInfo(){
    this.restriccionService.getRestriccionesConInfo().subscribe(res =>{
       this.restriccionesConInfo = res as RestriccionConInfo[];
       console.log(this.restriccionesConInfo)
    })

  }


  /**
  * Obtiene todas las restricciones perimetrales de la base de datos
  * @author Nicolás
  */
  obtenerRestriccionesPerimetrales(){
    this.restriccionService.getRestricciones().subscribe(
      restriccionesPerimetrales => {
        this.restriccionesPerimetrales = restriccionesPerimetrales as Restriccion[];
       
     }
   )  
  
  }
  /**
   * Obtiene todas las restricciones fisicas de la base de datos
   * @author Nicolás
   */
  obtenerRestriccionesFisicas() : void{
     this.restriccionService.getRestriccionesFisicas().subscribe(
      resFisicas => {
           this.restriccionesFisicasAMostrar = resFisicas as RestriccionFisicaEditar[];
           console.log( this.restriccionesFisicasAMostrar )
      }
    )  
  }
  /**
   * Obtiene las provincias necesarias 
   * @returns Provincia[]
   * @author Nicolás
  */
  obtenerProvincias() : void{
    this.spinner.show();
    this.provinciaLocalidadService.getProvincias()
      .subscribe(res => {
        this.spinner.hide();
        this.provincias = res as Provincia[];
      });
  }
  /**
   * Obtiene las localidades necesarias 
   * @author Nicolás
  */
  obtenerLocalidades() : void{
    this.spinner.show();
    this.provinciaLocalidadService.getLocalidades(this.provinciaSeleccionada)
      .subscribe(res => {
        this.spinner.hide();
        this.localidades = res as Localidad[];
      });
  }   
  /**
   * Agrega una nueva restricción física usando los datos del formulario 
   * @author Nicolás
  */
  agregarRestriccionFisica(NgForm : NgForm){
    if(this.editar) return

    console.log("llamando agregar")
    let restriccion : RestriccionFisica = new RestriccionFisica();
    restriccion.nombre = this.nombreRestriccion;
    restriccion.direccion = this.armarDireccion()
    restriccion.distancia = this.distancia;
    restriccion.idRestriccion = this.restriccionSeleccionada;
    this.spinner.show()
    this.restriccionService.postRestriccioFisica(restriccion).subscribe(res =>{
      this.toastr.success("Se ha ingresado con éxito la restricción física");
      this.spinner.hide()
      this.obtenerRestriccionesFisicasConInfo();
    })
    
  }
  /**
   * Retorna una direccion con los datos del forms
   * 
   * @returns Direccion
   * @author Nicolás
   */
  armarDireccion(){
    let direccion : Direccion = new Direccion()
    direccion.altura = this.altura;
    direccion.calle = this.calle;
    direccion.departamento = this.departamento
    direccion.idLocalidad = this.localidadSeleccionada
    direccion.piso = this.piso;
    return direccion;
  }

  /**
   * Elimana la restriccion física pasada por parámetro
   * @param restriccion 
   */

  eliminarRpFisica(restriccionId : number){

     this.restriccionService.deleteRestriccionFisica(restriccionId).subscribe(
      res=>{
        this.restriccionesFisicasAMostrar = this.restriccionesFisicasAMostrar
                                            .filter( restriccionFisica=>{return restriccionFisica.idRPLugar==restriccionId});
      }
     );
    

  }


  /**
   * Edita las restricciones físicas
   * @author Nicolás 
   */
  editarRestriccion(){
    console.log("llamando edicion")
    let restriccion : RestriccionFisicaEditar = new RestriccionFisicaEditar();
    restriccion.nombre = this.nombreRestriccion;
    restriccion.direccion = this.armarDireccion()
    restriccion.distancia = this.distancia;
    restriccion.idRestriccion = this.restriccionSeleccionada;
    restriccion.idRPLugar = this.restriccionAEditar;
    this.spinner.show()
    this.restriccionService.updateRestricciónFisica(restriccion).subscribe(res =>{
        this.obtenerRestriccionesFisicasConInfo();
        this.spinner.hide()
    });
  }

  /**
   * Pasa los datos al formulario y habilita la edición
   * @author Nicolás
   */
  pasarDatosAlFormulario(restriccion:RestriccionConInfo){
      this.nombreRestriccion = restriccion.rpLugar.nombre;
      this.calle = restriccion.rpLugar.direccion.calle;
      this.altura = restriccion.rpLugar.direccion.altura;
      this.piso = restriccion.rpLugar.direccion.piso;
      this.departamento = restriccion.rpLugar.direccion.departamento;
      this.distancia = restriccion.rpLugar.distancia;
      this.restriccionSeleccionada = restriccion.rpLugar.idRestriccion;
      this.provinciaSeleccionada =restriccion.provincia.idProvincia;
      this.localidadSeleccionada =restriccion.localidad.idLocalidad;
      this.restriccionAEditar = restriccion.rpLugar.idRPLugar;
      this.editar = true;
  }

  /**
   * Ordena la tabla por id
   * @author Nicolas
   */
  ordenarPorId(){
    console.log("asdasdasdasdasdasdasdasdasdasdasdas")
    let orden : number = this.ordenId ?  1:-1

    let restriccionesFisicas : RestriccionConInfo [] = this.restriccionesConInfo;
    restriccionesFisicas.sort((a,b)=>{
      if(a.rpLugar.idRPLugar > b.rpLugar.idRPLugar){
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenId = !this.ordenId;

  }


  /**
   * Ordena la tabla por id
   * @author Nicolas
   */
  ordenarPorNombre(){
    let orden : number = this.ordenNombre ?  1:-1

    let restriccionesFisicas : RestriccionConInfo [] = this.restriccionesConInfo;
    restriccionesFisicas.sort((a,b)=>{
      if(a.rpLugar.nombre > b.rpLugar.nombre){
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenNombre = !this.ordenNombre;

  }


   /**
   * Ordena la tabla por localidad
   * @author Nicolas
   */
   ordenarPorLocalidad(){
    let orden : number = this.ordenLocalidad ?  1:-1

    let restriccionesFisicas : RestriccionConInfo [] = this.restriccionesConInfo;
    restriccionesFisicas.sort((a,b)=>{
      if(a.localidad.nombre > b.localidad.nombre){
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenLocalidad = !this.ordenLocalidad
  }
  /**
   * Ordena la tabla por provincia
   * @author Nicolas
   */
  ordenarPorProvincia(){
    let orden : number = this.ordenProvincia ?  1:-1

    let restriccionesFisicas : RestriccionConInfo [] = this.restriccionesConInfo;
    restriccionesFisicas.sort((a,b)=>{
      if(a.provincia.nombre > b.provincia.nombre){
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenProvincia = !this.ordenProvincia
  }

  /**
   * Ordena la tabla por la calle
   * @author Nicolas
   */
  ordenarPorDireccion(){
    let orden : number = this.ordenDireccion ?  1:-1

    let restriccionesFisicas : RestriccionConInfo [] = this.restriccionesConInfo;
    restriccionesFisicas.sort((a,b)=>{
      if(a.rpLugar.direccion.calle > b.rpLugar.direccion.calle){
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenDireccion = !this.ordenDireccion
  }





}
