import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/login/usuario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import * as sha256 from 'js-sha256';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent implements OnInit {

  usuario: Usuario = new Usuario;

  contrasenavieja: string = "";
  contrasenanueva: string = "";
  contrasenanuevarepetida: string = "";

  constructor(
    private usuarioService: UsuarioService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUsuario();
  }

  getUsuario() {
    this.spinnerService.show();
    this.usuarioService.getUsuarioByEmail(localStorage.getItem('emailUsuario'))
      .subscribe(res => {
        this.spinnerService.hide();
        this.usuario = res as Usuario;
      })
  }

  modificarContrasena(usuarioForm: NgForm) {
    this.spinnerService.show();
    let contrasena = sha256.sha256(this.contrasenavieja);
    //Contraseña de usuario igual a ingresada
    if (this.usuario.contrasena == contrasena) {
      //Contraseñas nuevas iguales
      if (this.contrasenanueva == this.contrasenanuevarepetida) {
        this.usuario.contrasena = sha256.sha256(this.contrasenanuevarepetida);
        this.usuarioService.putUsuario(this.usuario)
          .subscribe(res => {
            this.spinnerService.hide();
            this.toastr.success('Contraseña modificada correctamente', 'Modificada!');
            usuarioForm.reset();
            this.router.navigate(["/"]);
            localStorage.setItem('emailUsuario', "");
            this.usuario = new Usuario;
            this.contrasenavieja = this.contrasenanueva = this.contrasenanuevarepetida = "";
          });
      }
      else {
        this.spinnerService.hide();
        this.contrasenanueva = "";
        this.contrasenanuevarepetida = "";
        this.toastr.error("Las contraseñas nuevas NO son iguales", "Error!");
      }
    }
    else {
      this.spinnerService.hide();
      this.contrasenavieja = "";
      this.toastr.error("La contraseña antigua NO es correcta", "Error!");
    }
  }

}
