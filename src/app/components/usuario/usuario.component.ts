import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/login/usuario.service';
import { Usuario } from '../../models/usuario';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import * as sha256 from 'js-sha256';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComunicacionService } from 'src/app/services/comunicacion/comunicacion.service';
import { ErrorDTO } from 'src/app/models/error-dto';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],
  providers: [UsuarioService]
})

export class UsuarioComponent implements OnInit {

  loginEsInvalido = false;

  constructor(
    public usuarioService: UsuarioService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private comunicacionService: ComunicacionService,
    private toastr: ToastrService) { }

  ngOnInit() {
  }

  ingresar(usuarioForm: NgForm) {
    this.spinner.show();
    if (usuarioForm.valid) {
      var mail = usuarioForm.value.mail;
      var contrasena = sha256.sha256(usuarioForm.value.contrasena);
      var datosValidos;
      this.usuarioService.login(mail, contrasena)
        .subscribe(res => {
          this.spinner.hide();
          datosValidos = res;
          console.log("email y contraseña : " + mail  + " " + contrasena); 
          console.log("es usuario valido? : " + datosValidos)
          if (datosValidos) {
            this.usuarioService.getUsuarioByEmail(mail).subscribe(res => {
              var usuarioLogueado = res as Usuario;
              this.comunicacionService.enviarUsuario(usuarioLogueado);
              localStorage.setItem('rolUsuario', usuarioLogueado.rolDeUsuario);
              localStorage.setItem('emailUsuario', mail);
              if(usuarioLogueado.rolDeUsuario == 'ADMINISTRATIVO'){
                this.router.navigate(["/inicio/restricciones"]);
              }
              else if(usuarioLogueado.rolDeUsuario == 'SUPERVISOR'){
                this.router.navigate(["/inicio/administrarRestricciones"]);
              }
              else if(usuarioLogueado.rolDeUsuario == 'SUPERVISOR_GENERAL'){
                console.log("soy supervisor general")
                this.router.navigate(["/inicio/supervisorGeneral"]);
              }
            })
          }
          else
            this.setLoginInvalido();
        });
    }
  }

  getUsuarios() {
    this.usuarioService.getUsuarios()
      .subscribe(res => {
        this.usuarioService.usuarios = res as Usuario[];
      })
  }

  setLoginInvalido(): void {
    this.loginEsInvalido = true;
    setTimeout(() => {
      this.loginEsInvalido = false;
    }, 5000);
  }

  recuperarContrasena() {
    if (this.usuarioService.usuarioSeleccionado.email != "") {
      let usuario = new Usuario;
      usuario.email = this.usuarioService.usuarioSeleccionado.email;
      usuario.rolDeUsuario = 'ADMINISTRATIVO';
      if (confirm("Una nueva contraseña se enviará al email ingresado. ¿Desea continuar?")) {
        this.spinner.show();
        this.usuarioService.recuperarContrasena(usuario)
          .subscribe(res => {
            let error = res as ErrorDTO;
            this.spinner.hide();
            if(error.hayError){
              this.toastr.error("" + error.mensajeError, "Error!");
            }
            else{
              this.toastr.success('Nueva contraseña enviada al email', 'Enviada!');
            }
          });
      }
    }
  }

}
