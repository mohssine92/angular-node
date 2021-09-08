import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { of, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';


import { AuthResponse, Usuario } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService { // centralizar logica de autenticacion voy a tnener login , logout , informacion de user activo

  private baseUrl: string = environment.baseUrl;
  private _usuario!: Usuario; // da err porue requie inicializacion , ! trankilo vas a tener valor confia en mi

  get usuario() { // un getter
    return { ...this._usuario }; // nuevo objecte rompe referencia - evitar en algun lugar manipular _usuario
  }


  constructor( private http: HttpClient ) { }

  registro( name: string, email: string, password: string ) {

    const url  = `${ this.baseUrl }/auth/new`;
    const body = { email, password, name };

    return this.http.post<AuthResponse>( url, body )
      .pipe( // login solo le interesa saber si la autenticacion se hizo exitosamente
        tap( ({ ok, token }) => {
          if ( ok ) {
            localStorage.setItem('token', token! ); // persistir data en nav por problema de refresh
          }
        }),
        map( resp => resp.ok ), // operador para mutar respuesta entrante - configurar la salida
        catchError( err => of(err.error.msg) ) // operador para attrapar bad request 400 etc.. , regresamos false pero en observable no boolean , asi usamos operador of emite valores como observable
      );
    //NB : cualquier valor incorrecto la observable no regresa un false en la peticion al backend - porque backend va regresar un err porque regresa un status de 400
  } // asi el htttpcomun modul de angular intrepreta cual quier cosa que no sea de status 200 como un err



  login( email: string, password: string ) {

    const url  = `${ this.baseUrl }/auth`;
    const body = { email, password };

    return this.http.post<AuthResponse>( url, body )
      .pipe(
        tap( resp => { // operador efecto segunadario no hace nada mas solo ejecutar el codigo del scope
          if ( resp.ok ) {
            localStorage.setItem('token', resp.token! );
          }
        }),
        map( resp => resp.ok ),
        catchError( err => of(err.error.msg) )
      );
  }




  validarToken(): Observable<boolean> {

    const url = `${ this.baseUrl }/auth/renew`;
    const headers = new HttpHeaders()
      .set('x-token', localStorage.getItem('token') || '' );  // si es nul mandamos un string vacio asi evitamos err - puede encadenar mas headers

    return this.http.get<AuthResponse>( url, { headers } )
        .pipe(
          map( resp => { // transformacion de data paraque lo accept me guard
            localStorage.setItem('token', resp.token! );
            this._usuario = {
              name: resp.name!,
              uid: resp.uid!,
              email: resp.email!
            } // gracias sera ejecuto por guards por los 2 metodos - asi antes cargar modulo este prop _usuario sera establecida + refresh por can active sera establecida otra vez
              // mostrar avatar del usuario etc ..

            return resp.ok; // returno observable true
          }),
          catchError( err => of(false) ) //bad request 400 etc .. toekn falle nos ea correcto - emito observable  false
        );

  } // revibe token y renovarlo + obtener infornmacion del usuario autenticado atraves de jwt

  logout() {
      localStorage.clear(); // borra cualquier cosa en storage de nuestra session
     //localStorage.removeItem('token'); // remueve solo toekn de autenticacion el correcto
  }


}
