import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {

  miFormulario: FormGroup = this.fb.group({
    email:    ['test1@test.com', [ Validators.required, Validators.email ]], // poner nombre de prop el mismo nombres que espera mi api
    password: ['123456', [ Validators.required, Validators.minLength(6) ]], // min(6) este es el valor nnumerico minimo
  });

  constructor( private fb: FormBuilder,
               private router: Router,
               private authService: AuthService) { }


  login() {

    const { email, password } = this.miFormulario.value; // estado valor de campos de form al momento de dipsra acction para  logear

    this.authService.login( email, password )
      .subscribe( ok => {

        if ( ok === true ) { // simpre sea un boolean - sin === es decir true o si existe valor
          this.router.navigateByUrl('/dashboard');
        } else {
          Swal.fire('Error', ok, 'error'); // ok => msg de bad request
        }
      });
  }

}
