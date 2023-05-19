import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DefaultViewComponent } from './defaultview/defaultview.component';
import { TaskBoardComponent } from './task-board/task-board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { ForgotPasswordDialogComponent } from './auth/forgot-password-dialog/forgot-password-dialog.component';
import { LoginDialogComponent } from './auth/login-dialog/login-dialog.component';
import { SignupDialogComponent } from './auth/signup-dialog/signup-dialog.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full'},
  { 
    path: '', component: AuthComponent, children: [
      { path: 'auth/login', component: LoginDialogComponent},
      { path: 'auth/forgotPassword', component: ForgotPasswordDialogComponent},
      { path: 'auth/signUp', component: SignupDialogComponent}
    ]
  },
  {
    path: '', component: DefaultViewComponent, children: [
      { path: 'project/summary', component: DashboardComponent },
      { path: 'project/tasks', component: TaskBoardComponent },
      { path: 'project/contacts', component: ContactsComponent },

    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
