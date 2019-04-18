import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ToastrService } from 'ngx-toastr';

import { AuthService } from './../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(
    private toastr: ToastrService,
    private spinnerService: Ng4LoadingSpinnerService,
    private authService: AuthService,
    private router: Router) {
    this.loginForm = new FormGroup({
      user: new FormControl(''),
      password: new FormControl('')
    });
  }

  ngOnInit() {
  }

  showError() {
    this.toastr.error('Usuário ou senha inválidos');
  }

  login() {
    this.spinnerService.show();
    this.authService.authenticate(this.loginForm.value.user, this.loginForm.value.password)
      .then(res => {
        this.spinnerService.hide();
        if (!res.success) {
          this.showError();
        } else {
          this.router.navigate(['/']);
        }
      }, (err) {

      })
  }

}
