import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidarTokenGuard } from './guards/validar-token.guard';

const routes: Routes = [

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ) // cuando recibo auth _> cargar modulo de auth
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./protected/protected.module').then( m => m.ProtectedModule ),
    canActivate: [ ValidarTokenGuard ], // todos guards que necesito ejecutarse para poder abrir esa routa de dashboard - funcion al cargar modulo
    canLoad: [ ValidarTokenGuard ] // lo mismo ,mismo funcion ala ctivar routa - sin pasar por via de carga de module
  },
  {
    path: '**',
    redirectTo: 'auth'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes  ,{
     useHash: false   // true // concatena # , en la forma que no puedo llegar a url - me soluciona prob del server de node de express
  } )],
  exports: [RouterModule]
})
export class AppRoutingModule { }


// el hash resuelve el problema pero la gente ne le gusta esta estrategia
// pues configuramos resolver prob en el server de node
