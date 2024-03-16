import { Component, OnInit } from '@angular/core';
import { Notificacion } from 'src/app/models/notificacion';
import { NotificacionService } from 'src/app/services/notificaciones/notificacion.service';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {

  notificaciones: Notificacion[];

  check = false;
  notificacionSeleccionada: Notificacion;

  cantidadNotificaciones: number = 20;

  constructor(private notificacionService: NotificacionService,
    config: NgbModalConfig, private modalService: NgbModal, 
    private spinnerService: NgxSpinnerService, private comunicacion: ComunicacionService) {
  }

  ngOnInit() {
    this.getNotificacionesNoArchivadas(this.comunicacion.administrativo.idUsuario, this.cantidadNotificaciones);
  }

  getNotificacionesArchivadas(idAdm: number, cantNotificaciones: number) {
    this.spinnerService.show();
    this.notificacionService.getNotificacionesArchivadas(idAdm, this.cantidadNotificaciones)
      .subscribe(res => {
        this.spinnerService.hide();
        this.notificaciones = res as Notificacion[];
      })
  }

  getNotificacionesNoArchivadas(idAdm: number, cantNotificaciones: number) {
    this.notificacionService.getNotificacionesNoArchivadas(idAdm, this.cantidadNotificaciones)
      .subscribe(res => {
        this.notificaciones = res as Notificacion[];
      })
  }

  verArchivadas() {
    this.cantidadNotificaciones = 20;
    if (this.check == true) {
      this.getNotificacionesArchivadas(this.comunicacion.administrativo.idUsuario, this.cantidadNotificaciones);
    }
    else {
      this.getNotificacionesNoArchivadas(this.comunicacion.administrativo.idUsuario, this.cantidadNotificaciones);
    }
  }

  open(content, notificacion) {
    this.notificacionSeleccionada = notificacion;
    this.setVista();
    this.modalService.open(content);
  }

  archivar() {
    this.notificacionService.archivarNotificacion(this.notificacionSeleccionada).subscribe(res => {
      this.getNotificacionesNoArchivadas(this.comunicacion.administrativo.idUsuario, this.cantidadNotificaciones);
      this.modalService.dismissAll();
    })
  }

  setVista() {
    if(this.notificacionSeleccionada.estado == 'NoVista'){
      this.notificacionService.notificacionSetVista(this.notificacionSeleccionada)
      .subscribe(res => {
        this.getNotificacionesNoArchivadas(this.comunicacion.administrativo.idUsuario, this.cantidadNotificaciones);
      })
    }
  }

  cargarMas(){
    this.cantidadNotificaciones += 20;
    if (this.check == true) {
      this.getNotificacionesArchivadas(this.comunicacion.administrativo.idUsuario, this.cantidadNotificaciones);
    }
    else {
      this.getNotificacionesNoArchivadas(this.comunicacion.administrativo.idUsuario, this.cantidadNotificaciones);
    }
  }
}
