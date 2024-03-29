import { Component, OnInit } from '@angular/core';
import { PruebaDeVida } from 'src/app/models/prueba-de-vida';
import { NgForm } from '@angular/forms';
import { PruebaDeVidaService } from 'src/app/services/pruebaDeVida/prueba-de-vida.service';
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import { NgxSpinnerService } from 'ngx-spinner';
import { FotoIdentificacion } from 'src/app/models/foto-identificacion';
import { FotoIdentificacionService } from 'src/app/services/fotoIdentificacion/foto-identificacion.service';
import { FotoPruebaDeVida } from 'src/app/models/foto-prueba-de-vida';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/services/personas/persona.service';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/login/usuario.service';

@Component({
  selector: 'app-pruebas-de-vida',
  templateUrl: './pruebas-de-vida.component.html',
  styleUrls: ['./pruebas-de-vida.component.css']
})
export class PruebasDeVidaComponent implements OnInit {

  pruebasDeVida: PruebaDeVida[];

  pruebaDeVida = new PruebaDeVida;
  spinnerBoolean: boolean = false;
  restriccion: RestriccionDTO;
  imgPerfil: String;
  imgPruebaDeVida: String;
  respondio: boolean = true;
  opcionesDesplegable: Persona[];
  seleccionado: Persona;
  selectedUserLabel: string = "Seleccione un usuario";
  usuarioSeleccionado: Usuario;


  constructor(
    private pruevaDeVidaService: PruebaDeVidaService,
    private comunicacion: ComunicacionService,
    config: NgbModalConfig, private modalService: NgbModal,
    private spinnerService: NgxSpinnerService,
    private personaService :PersonaService,
    private usuarioService : UsuarioService,
    private fotoIdentificacionService: FotoIdentificacionService) {
    
    config.backdrop = 'static';
    config.keyboard = false; 
  }

  ngOnInit() {
    if(this.comunicacion.restriccionDTO != null){
      this.restriccion = this.comunicacion.restriccionDTO;
      if( this.seleccionado != null )
        this.getPruebasDeVidaPersona(this.seleccionado.idPersona);
      this.spinnerService.show();
    this.fotoIdentificacionService.getFotoPefil(this.comunicacion.restriccionDTO.victimario.idPersona).
     subscribe( res => {
      this.spinnerService.hide();
        var foto = res as FotoIdentificacion;
        this.imgPerfil = foto.foto;
        console.log(res);
      });
    }
    this.opcionesDesplegable=[this.restriccion.victimario, this.restriccion.damnificada]
  }

  seleccionarOpcion(opcion: Persona) {
    this.personaService.getPersona(opcion.idPersona)
      .subscribe(
        (res: Persona) => {
          this.seleccionado = res;
          this.selectedUserLabel = "Usuario seleccionado: " + this.seleccionado.apellido;
        },
        (error) => {
          console.error('Error al obtener persona:', error);
        }
      );
  }
  

  enviarPruebaDeVida(pruebaDeVidaForm: NgForm) {
    this.pruebaDeVida.idRestriccion = this.comunicacion.restriccionDTO.restriccion.idRestriccion;
    this.usuarioService.getUsuario(this.seleccionado.idUsuario)
      .subscribe(
        (res: Usuario) => {
          this.usuarioSeleccionado = res;
          
          if (this.usuarioSeleccionado) {
            //Según el rol, verifico a quién enviar
            this.pruebaDeVida.idPersonaRestriccion = this.seleccionado.idPersona;
  
            this.pruebaDeVida.estado = "Pendiente";
            this.spinnerService.show();
            this.pruevaDeVidaService.postPruebaDeVida(this.pruebaDeVida)
              .subscribe(
                (res) => {
                  this.spinnerService.hide();
                  console.log(res);
                  pruebaDeVidaForm.reset();
                  this.pruebaDeVida = new PruebaDeVida;
                  this.getPruebasDeVidaPersona(this.pruebaDeVida.idPersonaRestriccion);
                },
                (error) => {
                  console.error('Error al enviar prueba de vida:', error);
                  this.spinnerService.hide();
                }
              );
              return false;
          } else {
            console.error('Usuario seleccionado no está definido.');
          }
        },
        (error) => {
          console.error('Error al obtener usuario:', error);
        }
      );
  }
  

  getPruebasDeVidaPersona(idPersona: number) {
    this.spinnerService.show();
    this.pruevaDeVidaService.getPruevasDeVidaPersona(idPersona)
      .subscribe(res => {
        this.spinnerService.hide();
        this.pruebasDeVida = res as PruebaDeVida[];
        console.log(res);
      })
  }

  aceptarPruebaDeVida(){
    this.spinnerService.show();
    this.pruebaDeVida.estado = "Aceptada";
    this.pruevaDeVidaService.putPruebaDeVida(this.pruebaDeVida)
    .subscribe(res => {
      console.log(res);
      this.pruebaDeVida = new PruebaDeVida;
      this.getPruebasDeVidaPersona(this.seleccionado.idPersona);
      this.modalService.dismissAll();
      this.spinnerService.hide();
    })
  }

  rechazarPruebaDeVida(){
    this.spinnerService.show();
    this.pruebaDeVida.estado = "Rechazada";
    this.pruevaDeVidaService.putPruebaDeVida(this.pruebaDeVida)
    .subscribe(res => {
      console.log(res);
      this.pruebaDeVida = new PruebaDeVida;
      this.getPruebasDeVidaPersona(this.seleccionado.idPersona);
      this.modalService.dismissAll();
      this.spinnerService.hide();
    })
  }

  open(content, prueba: PruebaDeVida) {
    this.pruebaDeVida = prueba;
    this.imgPruebaDeVida ="";
    this.respondio = true;
    this.getRespuestaPruebaDeVida();
    this.modalService.open(content, {size: 'xl'});
  }

  getRespuestaPruebaDeVida(){
    this.spinnerService.show();
    this.pruevaDeVidaService.getFotoPruebaDeVida(this.pruebaDeVida.idPruebaDeVida).
    subscribe( res => {
      this.spinnerService.hide();
       var foto = res as FotoPruebaDeVida;
       if (foto == null){
        this.respondio = false;
      }
      else{
       this.imgPruebaDeVida = foto.foto;
       console.log(res);
      }
     });
  }

  cerrarModal(){
    this.pruebaDeVida = new PruebaDeVida;
    this.modalService.dismissAll();
  }
}
