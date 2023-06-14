import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/services/auth/auth.service';

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
    initials: '',
    email: '',
    password: '',
    passwordCheck: '',
    userId: '',
  }

  checkPwMatch() {
    this.passwordsMatching = (this.formData.password == this.formData.passwordCheck)
  }

  submitForm() {    
    this.formData.initials = (this.formData.firstName.charAt(0) + this.formData.lastName.charAt(0))
    this.authService.SignUp(this.formData);
    
    console.log('Form data', this.formData);
    console.log('initials', this.formData.initials);
    
  }
}

