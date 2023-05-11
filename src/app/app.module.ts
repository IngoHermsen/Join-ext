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

// General

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { NavigationComponent } from './navigation/navigation.component';
import { AuthComponent } from './auth/auth.component';
import { MenuModule } from 'primeng/menu';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DefaultViewComponent } from './defaultview/defaultview.component';
import { LoginDialogComponent } from './auth/login-dialog/login-dialog.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TaskBoardComponent } from './task-board/task-board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordDialogComponent } from './auth/forgot-password-dialog/forgot-password-dialog.component';
import { SignUpDialogComponent } from './sign-up-dialog/sign-up-dialog.component';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { SidebarModule } from 'primeng/sidebar';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AuthService } from 'src/services/auth.service';
import { MessagesModule } from 'primeng/messages';
import { Card, CardModule } from 'primeng/card';




@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    AuthComponent,
    DashboardComponent,
    DefaultViewComponent,
    LoginDialogComponent,
    TaskBoardComponent,
    ContactsComponent,
    ForgotPasswordDialogComponent,
    SignUpDialogComponent,
    TaskDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MenuModule,
    DialogModule,
    ButtonModule,
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

    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore())
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
