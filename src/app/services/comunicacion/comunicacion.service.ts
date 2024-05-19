import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { RestriccionDTO } from 'src/app/models/restriccion-dto';
import { Usuario } from 'src/app/models/usuario';



@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {

  restriccionDTO: RestriccionDTO;
  administrativo: Usuario;

  enviarRestriccion(restriccion: RestriccionDTO){
    console.log(restriccion)
    this.restriccionDTO = restriccion;
  }

  enviarUsuario(usuario: Usuario){
    this.administrativo = usuario;
    console.log(this.administrativo);
  }

}
