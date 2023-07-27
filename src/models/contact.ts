export class Contact {
    uid: string;
    firstName: string;
    lastName: string;
    initials: string;
    email: string;
    displayName: string;

    constructor(contact?: any) {
        this.uid = contact.uid;
        this.firstName = contact.firstName;
        this.lastName = contact.lastName;
        this.initials = contact.initials;
        this.email = contact.email;
        this.displayName = contact.displayName;
    }
}