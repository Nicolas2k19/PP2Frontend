import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ErrorDTO } from 'src/app/models/error-dto';
import { Juzgado } from 'src/app/models/juzgado';
import { JuzgadoService } from 'src/app/services/juzgado/juzgado.service';

@Component({
  selector: 'app-juzgado',
  templateUrl: './juzgado.component.html',
  styleUrls: ['./juzgado.component.css','../styles/stylesGlobales.css']
})
export class JuzgadoComponent implements OnInit {

  juzgadoSeleccionado = new Juzgado;
  


  //filtros
  showSelect: boolean= false;
  nombreFilter: string;
  jurisdiccionFilter : string;
  ciudadFilter: String;
  editarBandera: boolean;

  hayError: boolean;

  //ordenamiento

  // Ordenamiento
  currentSortField: string = 'idJuzgado'; 
  currentSortDirection: string = 'asc'; 


  constructor(
    public juzgadoService: JuzgadoService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ){

  }


  ngOnInit(): void {
    console.log("Pantalla juzgados")
    this.getJuzgados();
    this.hayError = false;
    this.editarBandera = false;
    this.juzgadoSeleccionado = new Juzgado;
  }

  getJuzgados(){
    this.spinner.show();
    this.juzgadoService.getJuzgados()
      .subscribe(res => {
        this.spinner.hide();
        this.juzgadoService.juzgados = res as Juzgado[];

      })
  }


  //metodos front


  agregarJuzgado(juzgadoForm: NgForm) {
    this.spinner.show();
    // Editar si la bandera es true
    if (this.editarBandera) {
        this.juzgadoService.putJuzgado(this.juzgadoSeleccionado)
            .subscribe(res => {
                this.spinner.hide();
                this.toastr.success('Juzgado modificado correctamente', 'Modificado!');
                this.getJuzgados();
                juzgadoForm.resetForm();
                this.editarBandera = false;
                this.juzgadoSeleccionado = new Juzgado;
            });
    }
    // Guardar si la bandera es false
    else {
        this.juzgadoService.postJuzgado(this.juzgadoSeleccionado)
            .subscribe(res => {
                this.spinner.hide();
                var error = res as ErrorDTO;
                if (error.hayError) {
                    // Mostrar error
                    this.toastr.error( "Error!");
                } else {
                    this.toastr.success('Juzgado agregado correctamente', 'Agregado!');
                    this.getJuzgados();
                    juzgadoForm.resetForm();
                    this.editarBandera = false;
                    this.juzgadoSeleccionado = new Juzgado;
                }
            });
    }
}


  editarJuzgado(juzgado: Juzgado){
    this.juzgadoSeleccionado = juzgado;
    this.editarBandera =true;

  }

  eliminarJuzgado(idJuzgado: number) {
    this.spinner.show();
    this.juzgadoService.deleteJuzgado(idJuzgado)
      .subscribe(res => {
        this.spinner.hide();
        var error = res as ErrorDTO;
        if (error && error.hayError) {
          // Mostrar error
          this.toastr.error( "Error!");
        } else {
          this.toastr.success('Juzgado eliminado correctamente', 'Eliminado!');
          this.getJuzgados();
        }
      }, err => {
        this.spinner.hide();
        // Manejar error de conexión o de servidor
        this.toastr.error('Error al eliminar el juzgado', 'Error!');
      });
}


  //filtros

  toggleSelect() {
    this.showSelect = !this.showSelect;
  }

  filtros() {
    this.juzgadoService.getJuzgados()
      .subscribe(res => {
        this.juzgadoService.juzgados = res as Juzgado[];

        // Filtrar por nombre
        if (this.nombreFilter) {
          this.juzgadoService.juzgados = this.juzgadoService.juzgados.filter(juzgado =>
            juzgado.nombre.toLowerCase().includes(this.nombreFilter.toLowerCase())
          );
        }

        // Filtrar por jurisdiccion
        if (this.jurisdiccionFilter) {
          this.juzgadoService.juzgados = this.juzgadoService.juzgados.filter(juzgado =>
            juzgado.jurisdiccion.toLowerCase().includes(this.jurisdiccionFilter.toLowerCase())
          );
        }

        // Filtrar por ciudad
        if (this.ciudadFilter) {
          this.juzgadoService.juzgados = this.juzgadoService.juzgados.filter(juzgado =>
            juzgado.ciudad.toLowerCase().includes(this.ciudadFilter.toLowerCase())
          );
        }

        this.sortJuzgados();
      });
  }

  traerTodos() {
    this.nombreFilter = '';
    this.jurisdiccionFilter = '';
    this.ciudadFilter = '';
    this.getJuzgados();
  }

  ordenamiento(field: string) {
    if (this.currentSortField === field) {
      this.currentSortDirection = this.currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSortField = field;
      this.currentSortDirection = 'asc';
    }
    this.sortJuzgados();
  }

  sortJuzgados() {
    this.juzgadoService.juzgados.sort((a, b) => {
      let valueA, valueB;
      switch (this.currentSortField) {
        case 'nombre':
          valueA = a.nombre.toLowerCase();
          valueB = b.nombre.toLowerCase();
          break;
        case 'ciudad':
          valueA = a.ciudad.toLowerCase();
          valueB = b.ciudad.toLowerCase();
          break;
        case 'direccion':
          valueA = a.direccion.toLowerCase();
          valueB = b.direccion.toLowerCase();
          break;
        case 'contacto':
          valueA = a.contacto.toLowerCase();
          valueB = b.contacto.toLowerCase();
          break;
        case 'jurisdiccion':
          valueA = a.jurisdiccion.toLowerCase();
          valueB = b.jurisdiccion.toLowerCase();
          break;
        default:
          valueA = a.idJuzgado;
          valueB = b.idJuzgado;
      }

      if (valueA < valueB) {
        return this.currentSortDirection === 'asc' ? -1 : 1;
      } else if (valueA > valueB) {
        return this.currentSortDirection === 'asc' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  }


  

  

