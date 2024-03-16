import { Component, OnInit } from '@angular/core';
import { PersonaService } from 'src/app/services/personas/persona.service';
import { Persona } from 'src/app/models/persona';
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

  public mensajeError : string;
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

  public hayError : boolean;
  editarBandera: boolean = false;

  constructor(
    public personaService: PersonaService,
    private toastr: ToastrService,
    private provinciaLocalidadService: ProvinciaLocalidadService,
    private fotoIdentificacionService: FotoIdentificacionService,
    private spinner: NgxSpinnerService)
    
    {
    this.mensajeError =  "Ha ocurrido un error";
    this.hayError = false;
    this.roles = ['DAMNIFICADA', 'VICTIMARIO'];
  }

  ngOnInit() {
    this.getPersonas();
    this.getProvincias();
    this.editarBandera = false;
  }

  getPersonas() {
    this.spinner.show();
    this.personaService.getPersonas()
      .subscribe(res => {
        this.spinner.hide();
        this.personaService.personas = res as FormPersonaDTO[];
        console.log(res);
      })
  }

  guardarPersona(personaForm: NgForm){
    this.personaDTOSelleccionada.usuario.rolDeUsuario = this.rolSeleccionado;
    let ngbDate = personaForm.value.fechaNacimiento;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day+1);
    this.personaDTOSelleccionada.persona.fechaNacimiento = myDate;
    
    if(this.editarBandera == true){
      this.spinner.show();
      this.personaService.putPersona(this.personaDTOSelleccionada)
        .subscribe(res => {
          console.log(res);
          this.getPersonas();
          personaForm.reset();
          this.editarBandera = false;
          this.personaDTOSelleccionada = new FormPersonaDTO;
          this.spinner.hide();
        });
    }
    else{
      this.agregarPersona(personaForm);
    }
    this.editarBandera = false;

  }

  agregarPersona(personaForm: NgForm) {
    this.spinner.show();
    //CARGO DATOS DEL FORM A PERSONA
    this.personaDTOSelleccionada.usuario.rolDeUsuario = this.rolSeleccionado;
    let ngbDate = personaForm.value.fechaNacimiento;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    this.personaDTOSelleccionada.persona.fechaNacimiento = myDate;

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
          var error = res as ErrorDTO;
          if (error.hayError) {
            //MOSTRAR ERROR
            thisjr.toastr.error("" + error.mensajeError, "Error!");
            thisjr.setHayError();
            this.spinner.hide();
          }
          else {
            thisjr.toastr.success("Persona agregada correctamente", "Agregada!");
            console.log(thisjr.personaDTOSelleccionada);
            thisjr.getPersonas();
            personaForm.reset();
            this.spinner.hide();
          }
        })



    })

    //Funcion para usar en la promesa para esperar a que se cargue la foto
    function getBuffer(resolve) {
      var fileReader = new FileReader();
      fileReader.readAsDataURL(imgSeleccionadaBlob);
      fileReader.onload = function () {
        var imgBase64 = fileReader.result
        resolve(imgBase64);
      }
    }
  }

  setHayError(): void {
    this.hayError = true;
    setTimeout(() => {
      this.hayError = false;
    }, 5000);
  }

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
        if(this.localidad.nombre != ""){
          this.localidadSeleccionada = this.localidad.nombre;
        }
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
    console.log(persona);
  }

    //BUSCO LA LOCALIDAD DE LA PERSONA PARA TOMAR LA PROVINCIA 
    //Y LLENO LOS COMBOS
    getLocalidad(idLocalidad: number) {
      this.spinner.show();
      this.provinciaLocalidadService.getLocalidad(idLocalidad)
        .subscribe(res => {
          this.spinner.hide();
          this.localidad = res as Localidad;
          for(let i = 0; i < this.provincias.length; i++){
            if(this.provincias[i].idProvincia == this.localidad.idProvincia){
              this.provinciaSeleccionada = this.provincias[i].nombre;
              this.getLocalidades(this.localidad.idProvincia);
            }
          }
        });
    }
  
}
