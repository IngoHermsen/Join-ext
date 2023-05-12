import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent {
  passwordsMatching: boolean;

  constructor(
    public authService: AuthService
  ) {}

  @ViewChild('signUpForm') signUpForm?: NgForm;

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordCheck: '',
    userId: '',
  }

  checkPwMatch() {
    this.passwordsMatching = (this.formData.password == this.formData.passwordCheck)
  }

  submitForm() {
    this.authService.SignUp(this.formData.email, this.formData.password)
  }
}

