import { Component, OnInit } from '@angular/core';
import { NgForm,FormsModule } from '@angular/forms';
import RestriccionFisica from 'src/app/models/RestriccionFisica/RestriccionFisica';
import { Localidad } from 'src/app/models/localidad';
import {Provincia}  from 'src/app/models/provincia';
import { ProvinciaLocalidadService } from 'src/app/services/provincia-localidad/provincia-localidad.service';
import { RestriccionService } from 'src/app/services/restricciones/restriccion.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Direccion } from 'src/app/models/direccion';
@Component({
  selector: 'app-administrar-restricciones-fisicas',
 //imports : [FormsModule],
  templateUrl: './administrar-restricciones-fisicas.component.html',
  styleUrls: ['./administrar-restricciones-fisicas.component.css'],
})


export class AdministrarRestriccionesFisicasComponent implements OnInit{
  
  restriccionesFisicasAMostrar : RestriccionFisica[]
  provincias : Provincia[]
  provinciaSeleccionada : number;
  localidadSeleccionada : number;
  editar: Boolean;

  nombre : string;
  calle: string;
  piso : string
  departamento : string
  altura : string
  distancia : number

  localidades : Localidad[]

  constructor(public restriccionService : RestriccionService,
      public provinciaLocalidadService : ProvinciaLocalidadService
     ,private spinner: NgxSpinnerService){
      this.provincias = [];
      this.editar = false;

      
  }
 
  

  
  ngOnInit(): void {
  //  this.obtenerRestriccionesFisicas();
    this.obtenerProvincias();
    this.obtenerLocalidades();
    console.log(this.provincias)
  }



  /**
   * Obtiene todas las restricciones fisicas de la base de datos
   * @returns RestriccionFisica[]
   */

  obtenerRestriccionesFisicas() : RestriccionFisica[]{
     let restriccinesFisicas : RestriccionFisica[];
     this.restriccionService.getRestriccionesFisicas().subscribe(
      resFisicas => {
           restriccinesFisicas = resFisicas as RestriccionFisica[];
      }
    )  
    return restriccinesFisicas;
  }


  /**
   * Obtiene las provincias necesarias 
   * @returns Provincia[]
  */
  obtenerProvincias() : void{
    this.spinner.show();
    this.provinciaLocalidadService.getProvincias()
      .subscribe(res => {
        this.spinner.hide();
        this.provincias = res as Provincia[];
        console.log(this.provincias)
      });
   

  }

  /**
   * Obtiene las localidades necesarias 
  */
  obtenerLocalidades() : void{
    this.spinner.show();
    this.provinciaLocalidadService.getLocalidades(this.provinciaSeleccionada)
      .subscribe(res => {
        this.spinner.hide();
        this.localidades = res as Localidad[];
        console.log(this.localidades)
      });
   

  }

   


  agregarRestriccionFisica(){
    console.log("Llamando")
    let restriccion : RestriccionFisica;
    restriccion.nombre = this.nombre;
    restriccion.direccion =this.armarDireccion()
    restriccion.distancia = this.distancia;
    this.spinner.show()
    this.restriccionService.postRestriccioFisica(restriccion).subscribe(res =>{
      if(res!=null)
          console.log("Se logro publicar")

      this.spinner.hide()
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

}
