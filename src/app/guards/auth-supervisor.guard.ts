import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ComunicacionService } from '../services/comunicacion/comunicacion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthSupervisorGuard implements CanActivate {

  constructor(
    private comunicacion: ComunicacionService,
    private router: Router){
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    {
      if(localStorage.getItem('rolUsuario') == 'SUPERVISOR'){
        return true;
      }
      else{
        localStorage.setItem('rolUsuario', '');
        localStorage.setItem('emailUsuario', '');
        this.router.navigate(['/ingresar']);
        return false;
      }

  }
  
}
