import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  visible: boolean;

  @ViewChild('loginForm') loginForm?: NgForm

  formData = {
    usermail: '',
    password: '',
    rememberPassword: false
  }

  submitForm() {
    console.log(this.formData);
    this.loginForm?.reset();
  }

  constructor() {
    this.visible = true;
  }
}
