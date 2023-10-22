import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { RouteConfigLoadEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent implements OnDestroy {
  errorMessage: boolean = false;

  // subscriptions:
  resetMailSuccess: Subscription;

  @ViewChild('forgotPasswordForm') forgotPasswordForm?: NgForm;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  this.resetMailSuccess = this.authService.resetMailsuccessful.subscribe((value) => {
      if (value) {
        this.forgotPasswordForm.reset();
        this.router.navigate(['auth/login'])
      } else {
        this.errorMessage = true;
        setTimeout(() => {
          this.errorMessage = false;
        }, 4000)
      }

    })
  }

  ngOnDestroy(): void {
    this.resetMailSuccess.unsubscribe();
  }

  formData = {
    usermail: '',
  }

  submitForm() {
    this.authService.SendPasswordResetEmail(this.formData.usermail)

  }

}