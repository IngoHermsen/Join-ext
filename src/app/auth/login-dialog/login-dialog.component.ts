import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/services/auth/auth.service';
import { ViewService } from 'src/services/view/view.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  formActive: boolean = true;
  wrongInput: boolean;
  visible: boolean;

  constructor(
    public authService: AuthService,
    public viewService: ViewService,
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
    this.formActive = false;
    this.authService.SignIn(this.formData.usermail, this.formData.password)
      .then(() =>
        this.formActive = true

      )
    this.loginForm?.reset();
  }

}
