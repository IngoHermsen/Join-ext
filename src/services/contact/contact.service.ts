import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Subject, from, mergeMap } from 'rxjs';
import { Contact } from 'src/models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService implements OnInit {
  usersCollection = this.afs.collection('users');
  contactData: Contact;
  showDialog: Subject<boolean> = new Subject;
  activeUserId: string;
  activeUsersDoc: AngularFirestoreDocument;
  contactUsersDoc: AngularFirestoreDocument;
  newContactId: Subject<string> = new Subject;
  usersContacts: Array<any> = [];
  characters = [];

  constructor(
    public afs: AngularFirestore,
  ) {
    const userAsJson = JSON.parse(localStorage.getItem('user'));
    this.activeUserId = userAsJson.uid;
    this.activeUsersDoc = this.usersCollection.doc(this.activeUserId);

  }

  ngOnInit(): void {

  }


  addUserAsContact(userId: string) {
    this.newContactId.next(userId)
  }

  getContactList() {    
    this.usersContacts = [];    
    this.activeUsersDoc.get().pipe(mergeMap(userSnapshot => { 
                       
      return from<string[]>(userSnapshot.data()['contacts']);
    })).subscribe((contactId) => {      
      this.contactUsersDoc = this.usersCollection.doc(contactId);
      this._getContactData(contactId);
      
    })
  }


  _getContactData(userId) {    
    const contactUserDoc = this.usersCollection.doc(userId);
    contactUserDoc.get().subscribe((userSnapshot) => {
      const userData = userSnapshot.data();
      const contact: Contact = new Contact(
        {
          uid: userData['uid'],
          firstName: userData['firstName'],
          lastName: userData['lastName'],
          initials: userData['initials'],
          email: userData['email'],
          displayName: userData['firstName'] + " " + userData['lastName']
        }
      )      
      this.usersContacts.push(contact);
    
      this._updateCharacters(contact.lastName.charAt(0));
    })
  }

  _updateCharacters(character: string) {
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


