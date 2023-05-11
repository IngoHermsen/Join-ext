import { NgModule, ViewChild } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DefaultViewComponent } from './defaultview/defaultview.component';
import { TaskBoardComponent } from './task-board/task-board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ForgotPasswordDialogComponent } from './auth/forgot-password-dialog/forgot-password-dialog.component';
import { LoginDialogComponent } from './auth/login-dialog/login-dialog.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full'},
  { 
    path: '', component: AuthComponent, children: [
      { path: 'login', component: LoginDialogComponent},
      { path: 'forgotPassword', component: ForgotPasswordDialogComponent}
    ]
  },
  {
    path: '', component: DefaultViewComponent, children: [
      { path: 'summary', component: DashboardComponent },
      { path: 'tasks', component: TaskBoardComponent },
      { path: 'contacts', component: ContactsComponent },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
