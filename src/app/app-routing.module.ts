import { NgModule, ViewChild } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DefaultViewComponent } from './defaultview/defaultview.component';
import { TaskBoardComponent } from './task-board/task-board.component';
import { ContactsComponent } from './contacts/contacts.component';

const routes: Routes = [
  { path: '', component: AuthComponent }, 
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
