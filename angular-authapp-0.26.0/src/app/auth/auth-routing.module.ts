import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './pages/main/main.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

const routes: Routes = [

  {
    path: '',
    component: MainComponent, // siempre alguien entra al auth mostramos este componente - beneficios estilos independientes
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'registro', component: RegisterComponent },
      { path: '**', redirectTo: 'login' },
    ] // requiere  <router-outlet> para renderizacion dentro del mismo los children componente
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
