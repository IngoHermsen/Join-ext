import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscriber, map } from 'rxjs';
import { Contact } from 'src/models/contact';
import { User } from 'src/models/user';
import { ContactService } from 'src/services/contact/contact.service';

@Component({
  selector: 'app-contacts-dialog',
  templateUrl: './contacts-dialog.component.html',
  styleUrls: ['./contacts-dialog.component.scss']
})
export class ContactsDialogComponent {
  inputValue: string = null;
  users = []

  //Firebase Collection for Users
  usersCollectionRef = this.afs.collection('users');

  constructor(
    public afs: AngularFirestore,
    public contactService: ContactService,
  ) {
    this.inputValue = '';
    this.usersCollectionRef.get().subscribe((users) => {
      users.docs.map((entry) => {
        const userData = entry.data();
        const dbUser = {
          displayName: userData['firstName'] + " " + userData['lastName'],
          uid: userData['uid'],
          firstName: userData['firstName'],
          lastName: userData['lastName'],
          email: userData['email'],
          initials: userData['initials'],
          isContact: this.userIsContact(userData['uid']),
          entryAdded: false

        }

        if (dbUser.uid != contactService.activeUserId) {
          this.users.push(dbUser);

        }
      })
      console.log(this.users);
      
      this.sortUsers() 
    })
  }

  userIsContact(userId) {
    let value = false;
    for (let i = 0; i < this.contactService.usersContacts.length; i++) {
      if (userId == this.contactService.usersContacts[i].uid) {
        value = true;
        break;
      }
    }
    return value;
  }


  setInputValue(e) {
    this.inputValue = e.target.value;

  }

  inputMatches(user: any) {
    const transformedInputValue = this.inputValue.trim().toLowerCase();
    
    const nameToLowerCase: string = user['displayName'].toLowerCase();
    const mailToLowerCase: string = user['email'].toLowerCase();

    const nameMatches: boolean = nameToLowerCase.includes(transformedInputValue);
    const emailMatches: boolean = mailToLowerCase.includes(transformedInputValue);

    if (nameMatches || emailMatches) {
      return true;
    } else {
      return false;
    }
  }

  addAsContact(userId: string, index: number) {
    this.users[index].entryAdded = true;
    this.contactService.addUserAsContact(userId)

  }

  sortUsers() {
    this.users.sort((a, b) => {
      if(a.lastName < b.lastName) {
        return -1
      } else if ( a.lastName > b.lastName) {
        return 1;
      } else if ( a.firstName < a.firstName) {
        return -1
      } else {
        return 1;
      }
    })
    console.log(this.users);
    
  }


}
