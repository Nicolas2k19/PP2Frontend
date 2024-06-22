import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-supervisor-general',
  templateUrl: './supervisor-general.html',
  styleUrls: ['./supervisor-general.css'],

})

export class SupervisorGeneralComponent implements OnInit {


  rolDeUsuario = "";
  usuarioLogeado: string = "";
  hayError: boolean;

  constructor(
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.rolDeUsuario =  localStorage.getItem('rolUsuario');
    this.usuarioLogeado = localStorage.getItem('emailUsuario');
  }
}





