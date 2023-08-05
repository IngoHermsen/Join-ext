import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subject } from 'rxjs';
import { Contact } from 'src/models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService implements OnInit {
  usersCollection = this.afs.collection('users');
  contactData: Contact;
  showDialog: Subject<boolean> = new Subject;
  activeUserId: string;
  newContactId: Subject<string> = new Subject;
  usersContacts: Array<any> = [];

  constructor(
    public afs: AngularFirestore,
  ) {
    const userAsJson = JSON.parse(localStorage.getItem('user'));
    this.activeUserId = userAsJson.uid;
  }

  ngOnInit(): void {
  }


  addUserAsContact(userId: string) {
    this.newContactId.next(userId)
  }



}
