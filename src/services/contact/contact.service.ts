import { LiteralMapExpr } from '@angular/compiler';
import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { arrayRemove } from '@angular/fire/firestore';
import { Subject, from, map, mergeMap } from 'rxjs';
import { Contact } from 'src/models/contact';

@Injectable({
  providedIn: 'root'
})
export class ContactService implements OnInit {
  activeUserAsAssignable: Contact;
  usersCollection = this.afs.collection('users');
  contactData: Contact;
  showDialog: Subject<boolean> = new Subject;
  activeUserId: string;
  activeUsersDoc: AngularFirestoreDocument;
  newContactId: Subject<string> = new Subject;
  usersContacts: Array<Contact>;
  contactsLoaded: boolean = false;
  characters = [];
  
  fbContactRefCollection: AngularFirestoreCollection = null;

  constructor(
    public afs: AngularFirestore,
  ) {

    const userAsJson = JSON.parse(localStorage.getItem('user'));
    this.activeUserId = userAsJson.uid;
    this.activeUsersDoc = this.usersCollection.doc(this.activeUserId);
    this._setFirebaseUsersCollection()

  }

  ngOnInit(): void {
  }


  addUserAsContact(userId: string) {
    this.newContactId.next(userId)
  }

  _setFirebaseUsersCollection() {
    let usersCollectionName: string;
    if(this.activeUserId == 'LEhjHR9pKMOYrlmeMx9LqHpl05z2') {
      usersCollectionName = 'guest_users';
    } else {
      usersCollectionName = 'users';
    };

    this.fbContactRefCollection = this.afs.collection(usersCollectionName);    
  }

  getContactList() {
    this.usersContacts = [];
    this.activeUsersDoc.get().pipe(mergeMap(userSnapshot => {

      return from<string[]>(userSnapshot.data()['contacts']);
    })).subscribe({
      next: (contactId) => {
        const contactUsersDoc: AngularFirestoreDocument = this.fbContactRefCollection.doc(contactId);
        contactUsersDoc.get().subscribe((userSnapshot) => {
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
      },
      complete: () => {
        this.usersContacts.push(this.activeUserAsAssignable);        
        this.contactsLoaded = true;
      }
    },)
  }

  _updateCharacters(character: string) {
    if (this.characters.indexOf(character) === -1) {
      this.characters.push(character)
      this.sortCharacters();
    }
  }

  sortCharacters() {
    this.characters.sort((a, b) => {
      switch (a < b) {
        case true: return -1; break;
        default: return 1;
      }
    })
  }

  lastNameMatchesCharacter(contactsLastName: any, character: string) {
    return contactsLastName.charAt(0) === character;
  }

  removeContact(contact: Contact, index: number) {
    const contactCharacter = contact.lastName.charAt(0);
    this.usersContacts.splice(index, 1);
    if (this.characterIsEmpty(contactCharacter)) {
      const charIndex = this.characters.indexOf(contactCharacter);
      this.characters.splice(charIndex, 1)
    }

    this.activeUsersDoc.update({ contacts: arrayRemove(contact.uid) })
 
  }

  characterIsEmpty(character: string) {
    let characterIsEmpty: boolean = true;
    for (let i = 0; i < this.usersContacts.length; i++) {
      if (this.usersContacts[i].lastName.charAt(0) == character) {
        characterIsEmpty = false;
        break;
      }
    }
    return characterIsEmpty
  }

  setProfileState(state: boolean) {
    this.activeUsersDoc.update({ public: state })
  }
}




