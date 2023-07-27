import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { arrayUnion } from '@angular/fire/firestore';
import { map } from 'rxjs';
import { Contact } from 'src/models/contact';
import { ContactService } from 'src/services/contact/contact.service';
import { ViewService } from 'src/services/view/view.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent {
  usersCollection = this.afs.collection('users');
  activeUsersDoc = this.usersCollection.doc(this.contactService.activeUserId);
  contacts: Array<any> = [];

  constructor(
    public afs: AngularFirestore,
    public contactService: ContactService,
    public viewService: ViewService,
  ) {
    this.activeUsersDoc.get().pipe(map(userSnapshot => {
      const usersContacts = userSnapshot.data()['contacts']
      usersContacts.forEach(contactId => {
        this.getContactData(contactId)
      })
      })).subscribe()


    contactService.newContactId.subscribe((contactId) => {
      this.activeUsersDoc.update({ contacts: arrayUnion(contactId) })
    })
  }

  getContactData(userId) {
    const contactUserDoc = this.usersCollection.doc(userId);
    contactUserDoc.get().pipe(map(userSnapshot => {
      
      const contact: Contact = new Contact(
        { 
          uid: userSnapshot.data()['uid'],
          firstName: userSnapshot.data()['firstName'],
          lastName: userSnapshot.data()['lastName'],
          initials: userSnapshot.data()['initials'],
          email: userSnapshot.data()['email'],
          displayName: userSnapshot.data()['displayName'],
        }        
      );   
      
      this.contacts.push(contact);
      console.log('this.contacts:', this.contacts);
      
      
    })).subscribe()
    
  }


}
