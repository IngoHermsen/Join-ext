import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscriber, map } from 'rxjs';
import { Contact } from 'src/models/contact';

@Component({
  selector: 'app-contacts-dialog',
  templateUrl: './contacts-dialog.component.html',
  styleUrls: ['./contacts-dialog.component.scss']
})
export class ContactsDialogComponent {
  value: string;
  users: Array<any> = [

  ]


  //Firebase Collection for Users
  usersCollectionRef = this.afs.collection('users');

  //user Subscription

  constructor(
    public afs: AngularFirestore,
  ) {
    this.usersCollectionRef.get().subscribe((users) => {
      users.docs.map((entry) => {
        console.log(entry.data());
        const userData = entry.data();
        const dbUser = {
          fullName: userData['firstName'] + ' ' + userData['lastName'],
          email: userData['email'],
          initials: userData['initials']
        }
        this.users.push(dbUser);
        console.log('this.users:', this.users);

      })
    })
  }
}
