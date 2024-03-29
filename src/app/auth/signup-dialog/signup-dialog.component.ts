import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/services/auth/auth.service';

@Component({
  selector: 'app-signup-dialog',
  templateUrl: './signup-dialog.component.html',
  styleUrls: ['./signup-dialog.component.scss']
})
export class SignupDialogComponent {
  passwordsMatching: boolean;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {
    
  }

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

  submitForm(signUpForm: NgForm) {        
    this.formData.initials = (this.formData.firstName.charAt(0) + this.formData.lastName.charAt(0));
    this.authService.SignUp(this.formData)
    .then(() => {
      signUpForm.resetForm();
      this.router.navigate(['auth/login'])
    }); 

  }
}

