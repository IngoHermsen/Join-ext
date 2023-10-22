import { Component, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { ContactService } from 'src/services/contact/contact.service';

@Component({
  selector: 'app-contacts-dialog',
  templateUrl: './contacts-dialog.component.html',
  styleUrls: ['./contacts-dialog.component.scss']
})
export class ContactsDialogComponent implements OnDestroy {
  inputValue: string = null;
  users = [];
  characters = [];
  filteredCharacters = [];

  // Subscriptions:
  usersCollection: Subscription;

  //Firebase Contact Selection
  usersCollectionRef = this.contactService.fbContactRefCollection;

  constructor(
    public afs: AngularFirestore,
    public contactService: ContactService,
  ) {
    this.inputValue = '';
    this.usersCollection = this.usersCollectionRef.get().subscribe((users) => {
      users.docs.map((entry) => {
        const userData = entry.data();
        const dbUser = {
          displayName: userData['firstName'] + " " + userData['lastName'],
          uid: userData['uid'],
          firstName: userData['firstName'],
          lastName: userData['lastName'],
          email: userData['email'],
          initials: userData['initials'],
          public: userData['public'],
          isContact: this.userIsContact(userData['uid']),
          entryAdded: false
        }

        if (dbUser.uid != this.contactService.activeUserId && dbUser.public) {
          this.users.push(dbUser);
        }
      })
      this._sortUsers()
    })
  }

  ngOnDestroy(): void {
    this.usersCollection.unsubscribe();
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

  _sortUsers() {
    this.users.sort((a, b) => {
      if (a.lastName < b.lastName) {
        return -1;
      } else if (a.lastName > b.lastName) {
        return 1;
      } else if (a.firstName < a.firstName) {
        return -1;
      } else {
        return 1;
      }
    })
  }


}
