import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ValidarTokenGuard implements CanActivate, CanLoad {

  constructor( private authService: AuthService,
               private router: Router ){}


  canActivate(): Observable<boolean> | boolean {
    return this.authService.validarToken()
            .pipe(
              tap( valid => { // encadenar y disparar efectos segundarios
                //console.log('active')
                if ( !valid ) { //false - emito por of() con of observble
                  this.router.navigateByUrl('/auth');

                }

                // objeto debe traer rol - si no cumpla con preveligios lo saco fuera tambien - en este caso fluye tipo de data la solucion implementar otro guards y pasarlo al modulo
              })
            );
  } // despues de cargar el modulo . tenemos ... activarlo por el tema de precedent suivent . mantener la validacion mantener la proteccion

  canLoad(): Observable<boolean> | boolean {
    return this.authService.validarToken()
      .pipe(
        tap( valid => {

          if ( !valid ) { //false token invalid
            this.router.navigateByUrl('/auth');
          }
        })
      );
  }// se jecuta cuando intena a cargar modulo por primera vez - no protege precedent - suivant - porque no estamos cargando de nuevo modulo y no va a pasar por esta via

}



// aparte de dejar pasar user ,verificamos su token y obtener su data para tenrla siempre aunque por refresh
// si el toekn fuen manipulado en storage ni siquiera se carga el modulo protegido
// los gards son servicios provedidos en root lo cual no hay que importarlos en nigun modulo
// hemos trabajado guarda aqui pasar saber que se peude hacer - usalmente se ubica en el modulo que va a trabajar
