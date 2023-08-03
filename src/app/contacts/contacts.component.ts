import { AfterViewInit, Component, OnInit } from '@angular/core';
import { user } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { get } from '@angular/fire/database';
import { arrayUnion } from '@angular/fire/firestore';
import { Observable, concatMap, filter, find, from, map, mergeMap, of, switchMap } from 'rxjs';
import { Contact } from 'src/models/contact';
import { ContactService } from 'src/services/contact/contact.service';
import { ViewService } from 'src/services/view/view.service';
import { __values } from 'tslib';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {
  usersCollection = this.afs.collection('users');
  activeUsersDoc = this.usersCollection.doc(this.contactService.activeUserId);
  contactUsersDoc = null;
  contacts = [];
  characters = [];
  isLoading: boolean = true;

  constructor(
    public afs: AngularFirestore,
    public contactService: ContactService,
    public viewService: ViewService,
  ) {

    this.contactService.newContactId.subscribe((contactId) => {
      this.activeUsersDoc.update({ contacts: arrayUnion(contactId) })
      .then(() => {
        this.getContactList()
      })

    })
  }

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 800);

    this.getContactList()

  }

  ngAfterViewInit(): void {

  }

  getContactList() {
    this.contacts = [];
    this.activeUsersDoc.get().pipe(mergeMap(userSnapshot => {
      return from<string[]>(userSnapshot.data()['contacts']);
    })).subscribe((contactId) => {
      this.contactUsersDoc = this.usersCollection.doc(contactId);
      this.getContactData(contactId)
    })
  }


  getContactData(userId) {
    const contactUserDoc = this.usersCollection.doc(userId);
    contactUserDoc.get().subscribe((userSnapshot) => {
      const contact: Contact = new Contact(
        {
          uid: userSnapshot.data()['uid'],
          firstName: userSnapshot.data()['firstName'],
          lastName: userSnapshot.data()['lastName'],
          initials: userSnapshot.data()['initials'],
          email: userSnapshot.data()['email'],
          displayName: userSnapshot.data()['displayName'],
        }
      )
      this.contacts.push(contact);
      this.updateCharacters(contact.lastName.charAt(0));
      console.log(this.contacts);
    })
  }

  updateCharacters(character: string) {
    if (this.characters.indexOf(character) === -1) {
      this.characters.push(character)
      this.sortCharacters();
    }
  }

  sortCharacters() {
    this.characters.sort((a, b) => {
      switch(a < b) {
        case true: return 1; break;
        default: return -1;
      }
    })
    
  }

  lastNameMatchesCharacter(contactsLastName: any, character: string) {
    return contactsLastName.charAt(0) === character;
  }
}
