import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject } from 'rxjs';
import { Contact } from 'src/models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactData: Contact;
  showDialog: Subject<boolean> = new Subject;

  constructor(
    public afs: AngularFirestore
  ) { 
  }

  addUserAsContact(userId: string) {

    
  }
  
}
