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
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';

const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full'},

  { 
    path: '', component: AuthComponent, children: [
      { path: 'auth/login', component: LoginDialogComponent},
      { path: 'auth/forgotPassword', component: ForgotPasswordDialogComponent},
      { path: 'auth/signup', component: SignupDialogComponent},
      { path: 'auth/privacy-policy', component: PrivacyPolicyComponent },
      { path: 'auth/legal-notice', component: LegalNoticeComponent },
    ]
  },
  {
    path: '', component: DefaultViewComponent, children: [
      { path: 'summary', component: DashboardComponent },
      { path: 'tasks', component: TaskBoardComponent },
      { path: 'tasks/:id', component: TaskBoardComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'legal-notice', component: LegalNoticeComponent },
      
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
