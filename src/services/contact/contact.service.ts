import { Injectable, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from 'src/models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService implements OnInit {
  contactData: Contact;
  showDialog: Subject<boolean> = new Subject;
  activeUserId: string;
  newContactId: Subject<string> = new Subject;
  usersContacts: Array<any> = [];

  constructor() {
    const userAsJson = JSON.parse(localStorage.getItem('user'));
    this.activeUserId = userAsJson.uid;
  }

  ngOnInit(): void {
  }


  addUserAsContact(userId: string) {
    this.newContactId.next(userId)
  }

}
