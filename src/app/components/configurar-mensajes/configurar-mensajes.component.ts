
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faTelegram, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-configurar-mensajes',
  templateUrl: './configurar-mensajes.component.html',
  styleUrls: ['./configurar-mensajes.component.css', '../styles/stylesGlobales.css']
})

export class ConfigurarMensajesComponent implements OnInit {

  //iconos
  faTelegram = faTelegram;
  faWhatsapp = faWhatsapp;
  faEnvelope = faEnvelope;


  showTelegramConfig =false;
  telegramMessage ="Este es un mensaje de prueba.";
  showWhatsAppConfig =false;
  whatsAppMessage ="Este es un mensaje de prueba.";
  showMailConfig =false;
  mailMessage ="Este es un correo de prueba.";
  mailAsunto = "Este es un asunto de prueba";

  constructor(

  ) { }

  ngOnInit(): void {


    //Traer los mensajes que se estan usando ahora en cada mensajeria
    //Traer el mensaje que esta para telegram y guardarlo en telegramMessage y asi con todos.


  }


  abrirConfig(mensajeria: string){

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


  configurarMensajeTelegram(mensaje: string){

    console.log("Estoy para configurar lo de telegram y el mensaje es:" ,mensaje)


    //Logica para updatearlo en la BD ...

    this.telegramMessage = mensaje;

    
  }

  
  configurarMensajeWhatsApp(mensaje: string){
    console.log("Estoy para configurar lo de WSP")

    //Logica para updatearlo en la BD ...

    this.whatsAppMessage = mensaje;
    
  }



  configurarMensajeMail(asunto: string, mensaje: string){

    console.log("Estoy para configurar lo del mail")

    //Logica para updatearlo en la BD ...

    this.mailAsunto= asunto;
    this.mailMessage= mensaje;

    
    
    
  }


  


}