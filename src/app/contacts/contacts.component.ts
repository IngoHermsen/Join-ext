import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion } from '@angular/fire/firestore';
import { from, mergeMap } from 'rxjs';
import { Contact } from 'src/models/contact';
import { ContactService } from 'src/services/contact/contact.service';
import { ViewService } from 'src/services/view/view.service';
import { __values } from 'tslib';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, AfterViewInit {
  usersCollection = this.afs.collection('users');
  contactUsersDoc = null;
  characters = [];

  constructor(
    public afs: AngularFirestore,
    public contactService: ContactService,
    public viewService: ViewService,
  ) {

    this.contactService.newContactId.subscribe((contactId) => {
      this.contactService.activeUsersDoc.update({ contacts: arrayUnion(contactId) })
        .then(() => {
          this.contactService.getContactList()
        })

    })
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

  }

  removeContact(contact) {
    console.log(contact);
    
  }

}
