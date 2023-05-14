import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {

  wrongInput: boolean;
  visible: boolean;

  constructor(
    public authService: AuthService
  ) {
    this.visible = true;
    authService.noMatchingData.subscribe((value) => {
      this.wrongInput = value;
    })
  }

  @ViewChild('loginForm') loginForm?: NgForm

  formData = {
    usermail: '',
    password: '',
    rememberPassword: false
  }

  submitForm() {
    this.authService.SignIn(this.formData.usermail, this.formData.password)
    this.loginForm?.reset();
  }

}
