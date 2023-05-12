import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent {

  constructor(
    public authService: AuthService
  ) {
  }

  @ViewChild('signUpForm') signUpForm?: NgForm

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordCheck: '',
    userId: '',
  }
}
