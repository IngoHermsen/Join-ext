//Angular Fire
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

//UI Library
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SidebarModule } from 'primeng/sidebar';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { MessagesModule } from 'primeng/messages';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DragDropModule} from '@angular/cdk/drag-drop';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


//General

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { NavigationComponent } from './navigation/navigation.component';
import { AuthComponent } from './auth/auth.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DefaultViewComponent } from './defaultview/defaultview.component';
import { LoginDialogComponent } from './auth/login-dialog/login-dialog.component';

import { TaskBoardComponent } from './task-board/task-board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordDialogComponent } from './auth/forgot-password-dialog/forgot-password-dialog.component';
import { SidebarComponent } from './sidebar/sidebar.component';


import { AuthService } from 'src/services/auth/auth.service';
import { SignupDialogComponent } from './auth/signup-dialog/signup-dialog.component';
import { ProjectDialogComponent } from './project-dialog/project-dialog.component';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { ContactsDialogComponent } from './contacts-dialog/contacts-dialog.component';
import { LegalNoticeComponent } from './legal-notice/legal-notice.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';



@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    AuthComponent,
    DashboardComponent,
    DefaultViewComponent,
    TaskBoardComponent,
    ContactsComponent,
    ForgotPasswordDialogComponent,
    SignupDialogComponent,
    LoginDialogComponent,
    ProjectDialogComponent,
    TaskCardComponent,
    SidebarComponent,
    TaskDialogComponent,
    ContactsDialogComponent,
    LegalNoticeComponent,
    PrivacyPolicyComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MenuModule,
    DialogModule,
    ButtonModule,
    SplitButtonModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    MultiSelectModule,
    CalendarModule,
    SelectButtonModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    MessagesModule,
    CardModule,
    DropdownModule,
    AvatarModule,
    ProgressBarModule,
    MatProgressSpinnerModule,
    TooltipModule,
    InputSwitchModule,
    DragDropModule,
    

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore())
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
