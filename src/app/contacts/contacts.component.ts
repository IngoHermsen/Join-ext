import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { ContactService } from 'src/services/contact/contact.service';
import { ViewService } from 'src/services/view/view.service';
import { __values } from 'tslib';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {
  contactUsersDoc = null;
  characters = [];

  // Subscriptions:
  newContactId: Subscription;

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

  ngOnDestroy(): void {
    this.newContactId.unsubscribe();
  }
  
}
