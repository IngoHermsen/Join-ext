import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.scss']
})
export class ForgotPasswordDialogComponent {
  visible: boolean;

  @ViewChild('forgotPasswordForm') forgotPasswordForm?: NgForm

  formData = {
    usermail: '',
  }

  submitForm() {
    console.log(this.formData);
    this.forgotPasswordForm?.reset();
  }

  constructor() {
    this.visible = true;
  }
}