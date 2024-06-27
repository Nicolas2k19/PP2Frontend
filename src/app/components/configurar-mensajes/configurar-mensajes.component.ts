
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfigMensaje } from 'src/app/models/config-mensajes';
import { ConfigurarMensajesService } from 'src/app/services/config-mensajes/config-mensajes.service';


@Component({
  selector: 'app-configurar-mensajes',
  templateUrl: './configurar-mensajes.component.html',
  styleUrls: ['./configurar-mensajes.component.css', '../styles/stylesGlobales.css']
})

export class ConfigurarMensajesComponent implements OnInit {

  mensajes: ConfigMensaje[] = [];
  //iconos
  faTelegram = faTelegram;
  faWhatsapp = faWhatsapp;
  faEnvelope = faEnvelope;

  //mensaje de whatsapp
  tipoMensajeW: string = '';
  showWhatsAppConfig = false;
  showWspAlerta = false;
  showWspAlertaP = false;
  wspMessageBef;
  wspMessageBefP;
  wspMessageAft;
  wspMessageAftP;


  //mensaje telegram
  tipoMensajeT: string = '';
  showTelegramConfig = false;
  showTelegramAlerta = false;
  showTelegramAlertaP = false;
  telegramMessageBef;
  telegramMessageBefP;
  telegramMessageAft;
  telegramMessageAftP;


  //mail de contraseña
  tipoMensaje: string = '';
  showMailConfig = false;
  showMailPass = false;
  mailMessageBefPass;
  mailMessageAftPass;
  mailAsuntoPass;
  showMailAlerta = false;
  mailMessageBefAlerta;
  mailMessageAftAlerta;
  mailAsuntoAlerta;

  constructor(
    public configService: ConfigurarMensajesService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService

  ) { }

  ngOnInit(): void {
    this.getMensajes();
  }


  getMensajes() {
    this.spinner.show();
    this.configService.getMensajes()
      .subscribe(res => {
        this.spinner.hide();
        this.mensajes = res as ConfigMensaje[];
      })
  }



  abrirConfig(mensajeria: string) {

    switch (mensajeria) {
      case 'telegram':
        this.showTelegramConfig = true;
        this.showWhatsAppConfig = false;
        this.showMailConfig = false;
        break;
      case 'whatsapp':
        this.showTelegramConfig = false;
        this.showWhatsAppConfig = true;
        this.showMailConfig = false;
        break;
      case 'email':
        this.showTelegramConfig = false;
        this.showWhatsAppConfig = false;
        this.showMailConfig = true;
        break;
    }

  }

  handleSelectChange() {
    switch (this.tipoMensaje) {
      case 'cambioContraseña':
        this.resetSelect();
        this.showMailPass = true;
        this.showMailAlerta = false;
        this.showTelegramAlertaP = false;
        this.showTelegramAlerta = false;
        this.showWspAlertaP = false;
        this.showWspAlerta = false;
        this.getMail("passMail");
        break;
      case 'alertaDamnificada':
        this.resetSelect();
        this.showMailPass = false;
        this.showMailAlerta = true;
        this.showTelegramAlertaP = false;
        this.showTelegramAlerta = false;
        this.showWspAlertaP = false;
        this.showWspAlerta = false;
        this.getMail("alertaMail");
        break;
      case 'alertaTelegramP':
        this.resetSelect();
        this.showTelegramAlertaP = true;
        this.showTelegramAlerta = false;
        this.showMailPass = false;
        this.showMailAlerta = false;
        this.showWspAlertaP = false;
        this.showWspAlerta = false;
        this.getTelegram("alertaTelegramP");
        break;
      case 'alertaTelegram':
        this.resetSelect();
        this.showTelegramAlerta = true;
        this.showTelegramAlertaP = false;
        this.showMailPass = false;
        this.showMailAlerta = false;
        this.showWspAlertaP = false;
        this.showWspAlerta = false;
        this.getTelegram("alertaTelegram");
        break;
      //falta agregar lo de wsp
      case 'alertaWspP':
        this.resetSelect();
        this.showWspAlertaP = true;
        this.showWspAlerta = false;
        this.showTelegramAlertaP = false;
        this.showTelegramAlerta = false;
        this.showMailPass = false;
        this.showMailAlerta = false;
        this.getWsp("alertaWspP");
        break;
      case 'alertaWsp':
        this.resetSelect();
        this.showWspAlerta = true;
        this.showWspAlertaP = false;
        this.showTelegramAlerta = false;
        this.showTelegramAlertaP = false;
        this.showMailPass = false;
        this.showMailAlerta = false;
        this.getWsp("alertaWsp");
        break;
    }
  }

  resetSelect() {
    this.tipoMensaje = '';
  }

  getMail(tipoBuscado: string) {

    const mensajeEncontrado = this.mensajes.find(mensaje => mensaje.tipo === tipoBuscado);

    if (tipoBuscado === "passMail") {
      this.mailAsuntoPass = mensajeEncontrado.asunto;
      this.mailMessageBefPass = mensajeEncontrado.mensajeBef;
      this.mailMessageAftPass = mensajeEncontrado.mensajeAft;
    } else {
      this.mailAsuntoAlerta = mensajeEncontrado.asunto;
      this.mailMessageBefAlerta = mensajeEncontrado.mensajeBef;
      this.mailMessageAftAlerta = mensajeEncontrado.mensajeAft;
    }
  }

  getTelegram(tipoBuscado: string) {

    const mensajeEncontrado = this.mensajes.find(mensaje => mensaje.tipo === tipoBuscado);

    if (tipoBuscado === "alertaTelegram") {
      this.telegramMessageBef = mensajeEncontrado.mensajeBef;
      this.telegramMessageAft = mensajeEncontrado.mensajeAft;
    } else {
      this.telegramMessageBefP = mensajeEncontrado.mensajeBef;
      this.telegramMessageAftP = mensajeEncontrado.mensajeAft;
    }
  }

  getWsp(tipoBuscado: string) {
    const mensajeEncontrado = this.mensajes.find(mensaje => mensaje.tipo === tipoBuscado);

    if (tipoBuscado === "alertaWsp") {
      this.wspMessageBef = mensajeEncontrado.mensajeBef;
      this.wspMessageAft = mensajeEncontrado.mensajeAft;
    } else {
      this.wspMessageBefP = mensajeEncontrado.mensajeBef;
      this.wspMessageAftP = mensajeEncontrado.mensajeAft;
    }

  }


  configurarMensajeTelegram(tipo: string) {

    if (tipo === "alertaTelegram") {
      const telegramMsj = this.mensajes.find(mensaje => mensaje.tipo === 'alertaTelegram');
      telegramMsj.mensajeBef = this.telegramMessageBef;
      telegramMsj.mensajeAft = this.telegramMessageAft;

      this.configService.putMensaje(telegramMsj).subscribe();
    }

    if (tipo === "alertaTelegramP") {

      const mensajeTelegram = this.mensajes.find(mensaje => mensaje.tipo === 'alertaTelegramP');
      mensajeTelegram.mensajeBef = this.telegramMessageBefP;
      mensajeTelegram.mensajeAft = this.telegramMessageAftP;

      this.configService.putMensaje(mensajeTelegram).subscribe();

    }
  }



  configurarMensajeMail(tipo: string) {
    if (tipo === "passMail") {
      const telegramMsj = this.mensajes.find(mensaje => mensaje.tipo === 'passMail');
      telegramMsj.asunto = this.mailAsuntoPass;
      telegramMsj.mensajeAft = this.mailMessageAftPass;
      telegramMsj.mensajeBef = this.mailMessageBefPass;

      this.configService.putMensaje(telegramMsj

      ).subscribe();
    }

    if (tipo === "alertaMail") {

      const mensajeAlertaMail = this.mensajes.find(mensaje => mensaje.tipo === 'alertaMail');
      mensajeAlertaMail.asunto = this.mailAsuntoAlerta;
      mensajeAlertaMail.mensajeAft = this.mailMessageAftAlerta;
      mensajeAlertaMail.mensajeBef = this.mailMessageBefAlerta;

      this.configService.putMensaje(mensajeAlertaMail).subscribe();

    }
  }


  configurarMensajeWhatsApp(tipo: string) {

    if (tipo === "alertaWsp") {
      const wspMsj = this.mensajes.find(mensaje => mensaje.tipo === 'alertaWsp');
      wspMsj.mensajeBef = this.wspMessageBef;
      wspMsj.mensajeAft = this.wspMessageAft;

      this.configService.putMensaje(wspMsj).subscribe();
    }

    if (tipo === "alertaWspP") {

      const mensajeWsp = this.mensajes.find(mensaje => mensaje.tipo === 'alertaWspP');
      mensajeWsp.mensajeBef = this.wspMessageBefP;
      mensajeWsp.mensajeAft = this.wspMessageAftP;

      this.configService.putMensaje(mensajeWsp).subscribe();

    }

  }

  

}