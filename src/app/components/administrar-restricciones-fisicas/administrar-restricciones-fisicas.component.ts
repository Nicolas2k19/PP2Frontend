import { Component, OnInit } from '@angular/core';
import RestriccionFisica from 'src/app/models/RestriccionFisica/RestriccionFisica';
import { RestriccionService } from 'src/app/services/restricciones/restriccion.service';
@Component({
  selector: 'app-administrar-restricciones-fisicas',
  standalone: true,
  imports: [],
  templateUrl: './administrar-restricciones-fisicas.component.html',
  styleUrl: './administrar-restricciones-fisicas.component.css'
})
export class AdministrarRestriccionesFisicasComponent implements OnInit{
  
  restriccionesFisicasAMostrar : RestriccionFisica[]


  constructor(public restriccionService : RestriccionService){
    this.restriccionesFisicasAMostrar = []
  }
 
  

  
  ngOnInit(): void {
    this.restriccionesFisicasAMostrar = this.obtenerRestriccionesFisicas();
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


  agregarRestriccionFisica(){
    console.log("Agregando restriccion fisica");
  }

}
