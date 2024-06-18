import { Component, OnInit } from '@angular/core';
import { PersonaService } from 'src/app/services/personas/persona.service';
import { NgForm } from '@angular/forms';
import { FormPersonaDTO } from 'src/app/models/form-persona-dto';
import { ErrorDTO } from 'src/app/models/error-dto';
import { ToastrService } from 'ngx-toastr';
import { ProvinciaLocalidadService } from 'src/app/services/provincia-localidad/provincia-localidad.service';
import { Provincia } from 'src/app/models/provincia';
import { Localidad } from 'src/app/models/localidad';
import { FotoIdentificacion } from 'src/app/models/foto-identificacion';
import { FotoIdentificacionService } from 'src/app/services/fotoIdentificacion/foto-identificacion.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-administrar-personas',
  templateUrl: './administrar-personas.component.html',
  styleUrls: ['./administrar-personas.component.css']
})

export class AdministrarPersonasComponent implements OnInit {

  personaDTOSelleccionada = new FormPersonaDTO;
  fotoIdentificacion = new FotoIdentificacion;
  fecha: Date = new Date();
  maxDatePicker = { year: this.fecha.getFullYear(), month: this.fecha.getMonth() + 1, day: this.fecha.getDate() };
  fechaMarcador;

  //COMBO ROLES
  rolSeleccionado;
  roles;

  //COMBOS LOCALIDAD PROVINCIA
  provincias;
  provinciaSeleccionada;
  localidades;
  localidadSeleccionada;
  localidad: Localidad = new Localidad;

  //CONDOCIONALES PARA FORM
  mostrarImagen: boolean = false;
  imagenSeleccionada: File = null;

  hayError = false;
  editarBandera: boolean = false;
  mostrarDomicilio: boolean;

  //Ordenamiento de tablas
  ordenApellido: boolean;
  ordenNombre: boolean;
  ordenEdad: boolean;
  ordenFechaNac: boolean;
  ordenDni: boolean;

  //Filtros
  showSelect: boolean = false;
  dniFilter: string;
  originalPeople: FormPersonaDTO[] = [];

  constructor(
    public personaService: PersonaService,
    private toastr: ToastrService,
    private provinciaLocalidadService: ProvinciaLocalidadService,
    private fotoIdentificacionService: FotoIdentificacionService,
    private spinner: NgxSpinnerService) {
    this.roles = ['DAMNIFICADA', 'VICTIMARIO'];
    this.mostrarDomicilio = false;
    this.ordenApellido = false;
    this.ordenNombre = false;
    this.ordenEdad = false;
    this.ordenFechaNac = false;
    this.ordenDni = false;
  }

  ngOnInit() {
    this.getPersonas();
    this.getProvincias();
    this.editarBandera = false;
  }

  /**
   * Obtiene las personas 
   */
  getPersonas() {
    this.spinner.show();
    this.personaService.getPersonas()
      .subscribe(res => {
        this.spinner.hide();
        this.personaService.personas = res as FormPersonaDTO[];
        this.originalPeople = res as FormPersonaDTO[];
        console.log(res);
      })
  }

  /**
   * Guarda a una persona con la informacion del formulario pasada por parametro
   * @param personaForm 
   */
  guardarPersona(personaForm: NgForm) {
    if (this.editarBandera) {
      this.spinner.show();
      this.personaService.putPersona(this.personaDTOSelleccionada)
        .subscribe(res => {
          this.getPersonas();
          personaForm.reset();
          this.editarBandera = false;
          this.personaDTOSelleccionada = new FormPersonaDTO;
          this.spinner.hide();
          this.toastr.success("Se ha modificado al usuario");
          this.cambiarAVentanaPersona()
        });
    }
    else {
      this.agregarPersona(personaForm);
    }

    this.editarBandera = false;
  }

  /**
   * Agrega a una persona
   * @param personaForm 
   */
  agregarPersona(personaForm: NgForm) {
    this.spinner.show();
    console.log("Estoy en agregar")
    //CARGO DATOS DEL FORM A PERSONA
    //Logica para leer el archivo y guardarlo
    //Guardo la instancia del componente para usar dentro de la promesa, y el BLOB
    var imgSeleccionadaBlob;
    let thisjr = this;
    imgSeleccionadaBlob = new Blob([this.imagenSeleccionada]);

    //Creo la promesa para guardar la foto después de cargarla completamente
    var promise = new Promise(getBuffer);

    // Espero a terminar la funcion de la promesa, y entonces guardo.
    promise.then(function (imgBase64) {
      let img: string = imgBase64 as string;
      thisjr.personaDTOSelleccionada.foto = img;
      thisjr.personaService.postPersona(thisjr.personaDTOSelleccionada)
        .subscribe(res => {
          console.log("Estoy en el post con error")
          var error = res as ErrorDTO;

          if (error.hayError) {
            //MOSTRAR ERROR
            thisjr.toastr.error("Ha ocurrido un error" + error.mensajeError, "Error!");
            thisjr.spinner.hide();
            personaForm.reset();

          }
          else {
            thisjr.toastr.success("Persona agregada correctamente", "Agregada!");
            console.log("Agregue correctamente")
            console.log(thisjr.personaDTOSelleccionada);
            thisjr.getPersonas();
            personaForm.reset();
            thisjr.spinner.hide();
          }
          thisjr.cambiarAVentanaPersona()

        })
    })

    /**
     * Funcion para usar en la promesa para esperar a que se cargue la foto
     * @param resolve  se le pasa por parametro una promesa 
     */
    function getBuffer(resolve) {
      var fileReader = new FileReader();
      fileReader.readAsDataURL(imgSeleccionadaBlob);
      fileReader.onload = function () {
        var imgBase64 = fileReader.result
        resolve(imgBase64);
      }
    }
  }

  /**
   * Setea la propiedad hay error a true, luego de 5 segundos la setea a falso
   * 
   */
  setHayError(): void {
    this.hayError = true;
    setTimeout(() => {
      console.log("Ahora estoy en falso señor")
      this.hayError = false;
    }, 5000);
  }

  /**
   * 
   * @param event 
   */
  archivoSeleccionado(event) {
    //Obtengo la imagen seleccionada
    this.imagenSeleccionada = event.target.files[0];
    if (this.imagenSeleccionada != null)
      document.getElementById("labelImagen").innerHTML = "" + this.imagenSeleccionada.name;
    else
      document.getElementById("labelImagen").innerHTML = "Choose File";
  }

  eliminarPersona(persona: FormPersonaDTO) {
    console.log(persona.persona.idPersona);
    this.personaService.deletePersona(persona.persona.idPersona)
      .subscribe(res => {
        var error = res as ErrorDTO;
        if (error.hayError) {
          //MOSTRAR ERROR
          this.toastr.error("" + error.mensajeError, "Error!");
        }
        else {
          this.toastr.success('Persona eliminada correctamente', 'Eliminada!');
          this.getPersonas();
        }
      });
  }

  //SELECCION DE ROL PARA MOSTRAR U OCULTAR IMAGEN
  cambioRol() {
    if (this.rolSeleccionado == "VICTIMARIO")
      this.mostrarImagen = true;
    else
      this.mostrarImagen = false;
  }

  //Obtener las provincias
  getProvincias() {
    this.spinner.show();
    this.provinciaLocalidadService.getProvincias()
      .subscribe(res => {
        this.spinner.hide();
        this.provincias = res as Provincia[];
      });
  }

  //SELECCION DE PROVINCIA PARA LLENAR LAS LOCALIDADES
  cambioProvincia() {
    for (var i = 0; i < this.provincias.length; i++) {
      if (this.provincias[i].nombre == this.provinciaSeleccionada)
        this.getLocalidades(this.provincias[i].idProvincia);
    }
  }

  //SE LLENA LAS LOCALIDADES SEGUN PROVINCIA
  getLocalidades(idProvincia: number) {
    this.spinner.show();
    this.localidades = null;
    this.provinciaLocalidadService.getLocalidades(idProvincia)
      .subscribe(res => {
        this.spinner.hide();
        this.localidades = res as Localidad[];
        if (this.localidad.nombre != "") {
          this.localidadSeleccionada = this.localidad.nombre;
        }
        this.localidades.sort((a, b) => {
          if (a.nombre < b.nombre) {
            return -1;
          }
          if (a.nombre > b.nombre) {
            return 1;
          }
          return 0;
        });
      });
  }

  //SELECCION DE LOCALIDAD
  cambioLocalidad() {
    for (var i = 0; i < this.localidades.length; i++) {
      if (this.localidades[i].nombre == this.localidadSeleccionada) {
        this.personaDTOSelleccionada.direccion.idLocalidad = this.localidades[i].idLocalidad;
        return;
      }
    }
  }

  editarPersona(persona: FormPersonaDTO) {
    this.editarBandera = true;
    this.localidadSeleccionada = "";
    this.localidad = new Localidad;
    this.personaDTOSelleccionada = persona;
    this.rolSeleccionado = persona.usuario.rolDeUsuario;
    let date = new Date(persona.persona.fechaNacimiento);
    this.fechaMarcador = {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate() + 1
    };

    this.getLocalidad(persona.direccion.idLocalidad);
    this.cambioRol();
    this.cambiarAVentanaPersona()
  }

  //BUSCO LA LOCALIDAD DE LA PERSONA PARA TOMAR LA PROVINCIA 
  //Y LLENO LOS COMBOS
  getLocalidad(idLocalidad: number) {
    this.spinner.show();
    this.provinciaLocalidadService.getLocalidad(idLocalidad)
      .subscribe(res => {
        this.spinner.hide();
        this.localidad = res as Localidad;
        for (let i = 0; i < this.provincias.length; i++) {
          if (this.provincias[i].idProvincia == this.localidad.idProvincia) {
            this.provinciaSeleccionada = this.provincias[i].nombre;
            this.getLocalidades(this.localidad.idProvincia);
          }
        }
      });
  }

  /**
   * Cambio el valor de mostrar domicilio, a su contrario
  */
  negarMostrarDomicilio(personaForm) {
    let nombre: string = this.personaDTOSelleccionada.persona.nombre
    let apellido: string = this.personaDTOSelleccionada.persona.apellido
    let dni: string = this.personaDTOSelleccionada.persona.dni
    let telefono: string = this.personaDTOSelleccionada.persona.telefono
    let fechaNac: Date = this.personaDTOSelleccionada.persona.fechaNacimiento
    let email: string = this.personaDTOSelleccionada.usuario.email;
    this.personaDTOSelleccionada.usuario.rolDeUsuario = this.rolSeleccionado;
    let tipo: string = this.personaDTOSelleccionada.usuario.rolDeUsuario;

    if (nombre == "" || apellido == "" || dni == "" || telefono == "" || fechaNac == null || tipo == "" || email == "") {
      this.toastr.error("Faltan campos que llenar", "Error!");
      return;
    }

    let ngbDate = personaForm.value.fechaNacimiento;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    this.personaDTOSelleccionada.persona.fechaNacimiento = myDate

    this.toastr.success("Se ha verificado al usuario");
    this.mostrarDomicilio = !this.mostrarDomicilio;
  }

  cambiarAVentanaPersona() {
    this.mostrarDomicilio = false;
  }

  /**Ordena por orden alfabetico  la tabla de personas, tomando como referencia los nombres.
   * @returns void
   * @author Nicolás
  */
  ordenarPorNombreAscendente() {
    let orden: number = this.ordenNombre ? 1 : -1

    let personas: FormPersonaDTO[] = this.personaService.personas;
    personas.sort((a, b) => {
      if (a.persona.nombre > b.persona.nombre) {
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenNombre = !this.ordenNombre;
  }

  /**Ordena por orden alfabetico  la tabla de personas, tomando como referencia los nombres.
   * @returns void
   * @author Nicolás
  */
  ordenarPorApellidoAscendente() {
    let orden: number = this.ordenApellido ? 1 : -1
    let personas: FormPersonaDTO[] = this.personaService.personas;
    personas.sort((a, b) => {
      if (a.persona.apellido > b.persona.apellido) {
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenApellido = !this.ordenApellido;
  }

  /**Ordena la tabla de personas, tomando como referencia el dni.
   * @returns void
   * @author Nicolás
  */
  ordenarPorDNIAscendente() {
    let orden: number = this.ordenDni ? 1 : -1

    let personas: FormPersonaDTO[] = this.personaService.personas;
    personas.sort((a, b) => {
      if (a.persona.dni > b.persona.dni) {
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenDni = !this.ordenDni;
  }

  /**Ordena la tabla de personas, tomando como referencia la edad.
   * @returns void
   * @author Nicolás
   */
  ordenarPorEdad() {
    let orden: number = this.ordenEdad ? 1 : -1

    let personas: FormPersonaDTO[] = this.personaService.personas;
    personas.sort((a, b) => {
      if (a.persona.fechaNacimiento > b.persona.fechaNacimiento) {
        return 1 * orden
      }
      return -1 * orden
    })

    this.ordenEdad = !this.ordenEdad;
  }

  /*Filtros ------------------------------------*/

  toggleSelect() {
    this.showSelect = !this.showSelect;
  }

  filtros() {
    this.personaService.personas = this.originalPeople.filter(persona => {
      return this.dniFilter === persona.persona.dni;
    })
  }
}
