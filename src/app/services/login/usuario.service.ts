import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../../models/usuario';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuarioSeleccionado: Usuario;
  usuarios: Usuario[];
  readonly URL_API = environment.apiUrl+'/Usuario';
  readonly GET_POR_GRUPO = environment.apiUrl+'/Usuario'+'/obtenerUsuarioPorGrupo/';
  

  constructor(private http: HttpClient) {
    this.usuarioSeleccionado = new Usuario();
  }


  getUsuariosPorIdGrupo(id : Number){
    return this.http.get(this.URL_API+"/obtenerUsuarioPorGrupo/"+id);
  }


  getUsuarios(){
    return this.http.get(this.URL_API);
  }

  getUsuario(id : number){
    return this.http.get(this.URL_API+ `/${id}`);
  }

  postUsuario(usuario: Usuario){
    return this.http.post(this.URL_API, usuario);
  }
  
  deleteUsuario(id: number){
    return this.http.delete(this.URL_API + `/${id}`);
  }

  login(email: String, contrasena: String){
    const loginInfo = {};
    loginInfo["email"] = email;
    loginInfo["contrasena"] = contrasena;
    return this.http.post(this.URL_API+"/login", loginInfo);
  }
  /**
   * Obtiene a los usuarios que comparten el email pasado por parametro
   * @param email email pasado por parametro
   * @returns <Usuario>
   */
  getUsuarioByEmail(email: string){
    return this.http.get<Usuario>(this.URL_API+"/GetByEmail/"+email);
  }


  /**
   * Obtiene al usuario que coincida que el id pasado por parametro 
   * 
   */
  getUsuarioById(id: Number){
    return this.http.get(this.GET_POR_GRUPO+id);
  }


  /**
   * Obtiene al usuario que coincida con  el id de grupo pasado por parametro 
   * 
   */
  getUsuarioByGrupo(id: Number){
    return this.http.get(this.GET_POR_GRUPO+id);
  }


  /**
   * Modica al usuario pasado por parametro
   * @param usuario usuarioo con los nuevos valores
   * @returns 
   */
  putUsuario(usuario: Usuario){
    return this.http.put(this.URL_API+"/modificarUsuario", usuario);
  }

  recuperarContrasena(usuario: Usuario){
    return this.http.put(this.URL_API+"/recuperarContrasena", usuario);
  }

  filtrarEstado(estado: string){
    return this.http.get(this.URL_API+"/estadoUsuario/"+ estado);
  }

  filtrarRol(rol: string){
    return this.http.get(this.URL_API+"/rolDeUsuario/"+ rol);
  }

}
